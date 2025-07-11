import asyncio
import json
import os
import logging
from pydantic import BaseModel, Field
from typing import List, Optional, Tuple
from enum import Enum

"""
Konfigurasi logging untuk mengambil nama argumen dan mengembalikan instance logger
"""
logger = logging.getLogger(__name__)

class Severity(str, Enum):
    """
    Enum untuk severity, agar lebih mudah digunakan dalam model Pydantic.
    """
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"
    INFORMATIONAL = "Informational"
    OPTIMIZATION = "Optimization"
    UNKNOWN = "Unknown"

class StaticIssue(BaseModel):
    """
    Mendefinisikan struktur untuk issues yang di temukan dari analisis statis.
    Check: reentrancy-no-eth, unitialized-state, etc.
    Line: baris kode tempat isu ditemukan.
    Message: deskripsi.
    """
    check: str = Field(..., description="Jenis kerentanan yang terdeteksi.")
    severity: Severity = Field(..., description="Tingkat keparahan isu.")
    line: int = Field(..., description="Nomor baris kode tempat isu ditemukan.")
    message: str = Field(..., description="Deskripsi singkat tentang isu.")

class StaticAnalysisOutput(BaseModel):
    """
    Kontainer untuk output dari analisis statis
    issues: jika tidak ada isu, akan kosong.
    """
    tool_name: str
    issues: List[StaticIssue]
    error: Optional[str] = None

def _map_slither_impact_to_severity(impact: str) -> Severity:
    """Helper untuk memetakan string impact dari Slither ke Enum Severity."""
    try:
        # Mencoba mencocokkan langsung (misal: "High" -> Severity.HIGH)
        return Severity(impact.capitalize())
    except ValueError:
        # Jika gagal, berarti nilai tidak ada di Enum, kembalikan UNKNOWN
        logger.warning(f"Nilai impact Slither tidak dikenal: '{impact}'. Ditetapkan sebagai UNKNOWN.")
        return Severity.UNKNOWN

def format_slither_output(slither_raw_json: dict) -> List[StaticIssue]:
    """Mengubah output JSON dari Slither ke format StaticIssue."""
    formatted_issues = []
    if not slither_raw_json.get("success", False) or not slither_raw_json.get("results", {}).get('detectors'):
        return []
    
    for detector in slither_raw_json["results"]["detectors"]:
        line_number = -1
        if "elements" in detector and detector["elements"]:
            lines = detector["elements"][0].get("source_mapping", {}).get("lines", [])
            if lines:
                line_number = lines[0]

        impact_str = detector.get("impact", "Unknown")
        issue = StaticIssue(
            check=detector.get("check", "N/A"),
            severity=_map_slither_impact_to_severity(impact_str),
            line=line_number,
            message=detector.get("description", "No description available.").strip()
        )
        formatted_issues.append(issue)
    return formatted_issues

# --- Core Functions untuk Menjalankan Tools ---

async def run_tool(command: List[str]) -> Tuple[Optional[dict], Optional[str]]:
    """Helper untuk menjalankan command line tool secara asynchronous."""
    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()
    
    stdout_str = stdout.decode('utf-8', errors='ignore').strip()
    stderr_str = stderr.decode('utf-8', errors='ignore').strip()

    if process.returncode != 0 and not stdout_str:
        return None, f"Process exited with code {process.returncode}. STDERR: {stderr_str}"

    try:
        return json.loads(stdout_str), None
    except json.JSONDecodeError:
        return None, f"Failed to parse JSON output. STDOUT: {stdout_str[:500]}... STDERR: {stderr_str}"

async def _run_command(command: List[str]) -> Tuple[str, str, int]:
    """Helper untuk menjalankan command dan menangkap output."""
    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()
    
    stdout_str = stdout.decode('utf-8', errors='ignore').strip()
    stderr_str = stderr.decode('utf-8', errors='ignore').strip()
    
    return stdout_str, stderr_str, process.returncode

async def run_slither(file_path: str, solc_version: str) -> StaticAnalysisOutput:
    """Menjalankan Slither dan memformat hasilnya."""
    # 1. Coba instal versi solc yang dibutuhkan secara otomatis
    logger.info(f"Memastikan solc versi {solc_version} terinstal...")
    install_command = ["solc-select", "install", solc_version]
    _, install_stderr, install_code = await _run_command(install_command)
    
    if install_code != 0:
        error_msg = f"Gagal menginstal solc versi {solc_version}. Error: {install_stderr}"
        logger.error(error_msg)
        return StaticAnalysisOutput(tool_name="Slither", issues=[], error=error_msg)
    logger.info(f"Solc versi {solc_version} berhasil diinstal atau sudah ada.")

    # 2. Jalankan Slither menggunakan versi solc yang sudah dipastikan
    solc_args = "--allow-paths ."
    slither_command = [
        "slither", file_path, 
        "--solc-solcs-select", solc_version, 
        "--json", "-",
        "--solc-args", solc_args
    ]
    logger.info(f"Menjalankan Slither dengan perintah: {' '.join(slither_command)}")
    
    slither_stdout, slither_stderr, slither_code = await _run_command(slither_command)

    # Penanganan error jika Slither gagal
    if slither_code != 0 and not slither_stdout:
        error_msg = f"Slither execution failed with code {slither_code}. STDERR: {slither_stderr}"
        logger.error(error_msg)
        return StaticAnalysisOutput(tool_name="Slither", issues=[], error=error_msg)

    # Penanganan error jika output bukan JSON
    try:
        output_json = json.loads(slither_stdout)
    except json.JSONDecodeError:
        error_msg = f"Failed to parse JSON output from Slither. STDOUT: {slither_stdout[:500]}..."
        logger.error(error_msg)
        return StaticAnalysisOutput(tool_name="Slither", issues=[], error=error_msg)

    # Penanganan error internal yang dilaporkan oleh Slither
    if not output_json.get("success"):
        internal_error = output_json.get("error", "Unknown Slither error.")
        error_msg = f"Slither reported an internal error: {internal_error}"
        logger.error(error_msg)
        return StaticAnalysisOutput(tool_name="Slither", issues=[], error=error_msg)

    issues = format_slither_output(output_json)
    logger.info(f"Slither selesai, menemukan {len(issues)} isu.")
    return StaticAnalysisOutput(tool_name="Slither", issues=issues)

async def run_analysis(file_path: str, solc_version: str) -> StaticAnalysisOutput:
    """
    Fungsi utama untuk modul ini. Menjalankan semua tool statis
    dan menggabungkan hasilnya.
    """
    logger.info(f"Memulai semua analisis statis untuk versi solc: {solc_version}")
    cleaned_version = solc_version.strip("^~=> ")
    slither_task = run_slither(file_path, cleaned_version)

    results = await asyncio.gather(slither_task)
    
    all_issues = []
    all_errors = []
    for res in results:
        all_issues.extend(res.issues)
        if res.error:
            all_errors.append(f"[{res.tool_name}]: {res.error}")
            
    # De-duplikasi berdasarkan check, line, dan severity
    unique_issues_map = {}
    for issue in all_issues:
        key = (issue.check, issue.line, issue.severity)
        if key not in unique_issues_map:
            unique_issues_map[key] = issue

    unique_issues = list(unique_issues_map.values())
    
    logger.info(f"Total isu statis unik yang ditemukan: {len(unique_issues)}")
    
    return StaticAnalysisOutput(
        tool_name="Static Analysis Suite",
        issues=unique_issues,
        error=" | ".join(all_errors) if all_errors else None
    )