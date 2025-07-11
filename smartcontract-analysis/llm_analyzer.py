import os
import json
import requests
import asyncio
import logging
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Dict, Any, Optional

from prompt import KAG_SYSTEM_PROMPT
from recomendation_prompt import RECOMMENDATION_SYSTEM_PROMPT

# Konfigurasi logging
logger = logging.getLogger(__name__)

# --- Pydantic Models untuk Analisis LLM ---

class LLMIssue(BaseModel):
    """Model untuk satu isu yang ditemukan oleh LLM."""
    severity: str = Field(..., description="Tingkat keparahan: 'Kritis', 'Tinggi', 'Sedang', 'Rendah', atau 'Informasional'.")
    category: str = Field(..., description="Kategori isu, cth: 'Logic Flaw', 'Economic Risk', 'Centralization', 'Gas Optimization'.")
    description: str = Field(..., description="Penjelasan detail mengenai risiko atau saran perbaikan.")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Tingkat keyakinan LLM terhadap temuannya (0.0 - 1.0).")

    # Tambahkan validator untuk memastikan severity valid
    @field_validator('severity')
    def validate_and_normalize_severity(cls, v: str) -> str:
        normalized_v = v.capitalize()
        allowed_severities = {'Kritis', 'Tinggi', 'Sedang', 'Rendah', 'Informasional'}

        if normalized_v not in allowed_severities:
            raise ValueError(f"Nilai severity '{v}' tidak valid. Harus salah satu dari: {allowed_severities}")
        
        return normalized_v
class LLMAnalysisResult(BaseModel):
    """Model untuk output akhir dari analisis LLM."""
    executive_summary: str = Field(..., description="Ringkasan eksekutif 2-3 kalimat tentang postur keamanan kontrak secara keseluruhan.")
    overall_risk_grading: str = Field(..., description="Penilaian risiko holistik dalam satu kata: 'Kritis', 'Tinggi', 'Sedang', atau 'Rendah'.")
    risk_score: int = Field(..., ge=0, le=100, description="Skor risiko numerik dari 0 (sangat aman) hingga 100 (sangat kritis).")
    findings: List[LLMIssue] = Field(..., description="Daftar semua temuan dari LLM.")
    error: Optional[str] = None

    # Validator model untuk konsistensi laporan
    @model_validator(mode='after')
    def check_risk_grading_consistency(self) -> 'LLMAnalysisResult':
        # Jika tidak ditemukan issue berarti grading tidak Kritis/Tinggi
        if not self.findings:
            if self.overall_risk_grading in {'Kritis', 'Tinggi'}:
                logger.warning(f"Grading '{self.overall_risk_grading}' tidak konsisten karena tidak ada temuan. "
                    "Memperbaiki menjadi 'Rendah'.")
                self.overall_risk_grading = 'Rendah'
            return self
        
        severity_rank = {'Kritis': 4, 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1, 'Informasional': 0}

        # Cari tingkat keparahan tertinggi
        max_rank_in_findings = 0
        highest_severity_in_findings = "Informasional"
        for issue in self.findings:
            rank = severity_rank.get(issue.severity, 0)
            if rank > max_rank_in_findings:
                max_rank_in_findings = rank
                highest_severity_in_findings = issue.severity
        overall_grading_rank = severity_rank.get(self.overall_risk_grading, 0)

        # Jika grading lebih rendah dari issue tertinggi, perbaiki
        if overall_grading_rank < max_rank_in_findings:
            logger.warning(
                f"Inkonsistensi terdeteksi: 'overall_risk_grading' dari LLM adalah '{self.overall_risk_grading}', "
                f"tetapi temuan terparah adalah '{highest_severity_in_findings}'. "
                f"Memperbaiki secara otomatis.")
            self.overall_risk_grading = highest_severity_in_findings
        return self

class LLMRecommendation(BaseModel):
    """
    Model untuk rekomenasi perbaikan
    """
    original_check: str
    original_message: str
    line_number: int
    explanation: str
    recommended_code_snippet: str

class LLMRecommendationResult(BaseModel):
    """
    Model output rekomendasi LLM
    """
    recommendations: List[LLMRecommendation]
    error: Optional[str] = None

# --- Core Functions ---

async def _call_llm_api(prompt: str, timeout: int=180) -> Dict[str, Any]:
    """
    Untuk memanggil API Gemini
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY tidak ditemukan di environment variables.")
        raise ValueError("GEMINI_API_KEY tidak ditemukan di env")
    
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.1,
            "topP": 0.95,
        }
    }
    loop = asyncio.get_running_loop()
    response = await loop.run_in_executor(
        None,
        lambda: requests.post(api_url, json=payload, timeout=timeout)
    )
    response.raise_for_status()
    response_json = response.json()

    if not response_json.get('candidates') or not response_json['candidates'][0].get('content'):
        raise KeyError("Struktur respons LLM tidak valid: 'candidates' atau 'content' tidak ada.")
    
    result_text = response_json['candidates'][0]['content']['parts'][0]['text']
    return json.loads(result_text)

async def run_analysis(full_input_json: Dict[str, Any]) -> LLMAnalysisResult:
    """
    Fungsi utama untuk modul ini. Menjalankan analisis LLM KAG.
    """
    logger.info("Memulai analisis kontekstual LLM (KAG)...")

    try:
        knowledge_base_str = json.dumps(full_input_json, indent=2)
        prompt = KAG_SYSTEM_PROMPT.format(knowledge_base_str=knowledge_base_str)
        report_data = await _call_llm_api(prompt)
        validated_report = LLMAnalysisResult(**report_data)
        logger.info("Analisis LLM (KAG) berhasil dan output telah divalidasi.")
        return validated_report
    except KeyError as e:
        error_msg = f"Struktur respons LLM tidak valid: {e}"
        logger.error(error_msg, exc_info=True)
        return LLMAnalysisResult(executive_summary="", overall_risk_grading="Error", findings=[], error=error_msg)
    
async def generate_recommendations(static_findings: List[Dict[str, Any]]) -> LLMRecommendationResult:
    """
    Fungsi untuk menghasilkan rekomendasi perbaikan berdasarkan temuan analisis statis.
    """
    logger.info("Memulai proses rekomendasi LLM berdasarkan temuan statis...")
    if not static_findings:
        logger.info("Tidak ada temuan statis yang diberikan untuk rekomendasi.")
        return LLMRecommendationResult(recommendations=[], error="Tidak ada temuan statis yang diberikan.")

    try:
        static_findings_str = json.dumps(static_findings, indent=2)
        prompt = RECOMMENDATION_SYSTEM_PROMPT.format(static_findings_str=static_findings_str)

        recommendation_data = await _call_llm_api(prompt)

        validated_report = LLMRecommendationResult(**recommendation_data)
        logger.info("Rekomendasi LLM berhasil dan output telah divalidasi.")
        return validated_report
    except KeyError as e:
        error_msg = f"Struktur respons rekomendasi tidak valid: {e}"
        logger.error(error_msg, exc_info=True)
        return LLMRecommendationResult(recommendations=[], error=error_msg)