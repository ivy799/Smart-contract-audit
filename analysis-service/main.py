import uvicorn
import os
import json
import asyncio
import tempfile
import requests
import logging
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from fastapi.middleware.cors import CORSMiddleware

import static_analyzer
import llm_analyzer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

from dotenv import load_dotenv
load_dotenv()

class AnalysisMetadata(BaseModel):
    """Metadata tentang kontrak yang dianalisis."""
    file_path: Optional[str] = Field(None, description="Path file dari kontrak yang dianalisis, jika tersedia.")
    token_address: str = Field(..., description="Alamat token kontrak di blockchain.")
class FinalResponse(BaseModel):
    """Model output akhir yang menggabungkan hasil dari kedua analisis."""
    metadata: AnalysisMetadata = Field(..., description="Informasi sumber tentang kontrak yang dianalisis.")
    static_analysis_report: static_analyzer.StaticAnalysisOutput = Field(..., description="Hasil dari analisis statis menggunakan Slither dan Mythril.")
    llm_contextual_report: llm_analyzer.LLMAnalysisResult = Field(..., description="Hasil dari analisis kontekstual oleh LLM dengan Knowledge-Augmented Generation (KAG).")

app = FastAPI(
    title="Hybrid Smart Contract Analyzer",
    description="Menjalankan analisis statis (Slither, Mythril) dan analisis LLM (KAG) secara paralel menggunakan Docker.",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_source_code_from_etherscan(address: str) -> str:
    """
    Mengambil source code dari Etherscan menggunakan API.
    Membutuhkan ETHERSCAN_API_KEY di environment.
    """
    api_key = os.getenv("ETHERSCAN_API_KEY")
    if not api_key:
        logger.error("ETHERSCAN_API_KEY tidak ditemukan di environment variables.")
        raise HTTPException(status_code=500, detail="Server error: ETHERSCAN_API_KEY tidak dikonfigurasi.")

    api_url = f"https://api.etherscan.io/api?module=contract&action=getsourcecode&address={address}&apikey={api_key}"
    
    logger.info(f"Mengambil source code untuk alamat: {address}")
    
    try:
        response = requests.get(api_url, timeout=20)
        response.raise_for_status()
        data = response.json()

        if data['status'] == '1' and data['result'][0]['SourceCode']:
            source_code = data['result'][0]['SourceCode']
            if source_code.startswith('{{') and source_code.endswith('}}'):
                source_code = source_code[1:-1]
                try:
                    source_files = json.loads(source_code)
                    combined_code = ""
                    for file_info in source_files.get('sources', {}).values():
                        combined_code += file_info.get('content', '') + "\n\n"
                    logger.info("Source code multi-file berhasil digabungkan.")
                    return combined_code
                except json.JSONDecodeError:
                    pass
            
            logger.info("Source code berhasil diambil dari Etherscan.")
            return source_code
        else:
            error_message = data.get('message', 'Kontrak mungkin tidak terverifikasi atau alamat tidak valid.')
            logger.warning(f"Gagal mengambil source code dari Etherscan: {error_message}")
            raise HTTPException(status_code=404, detail=f"Tidak dapat mengambil source code untuk alamat {address}. Pesan: {error_message}")

    except requests.exceptions.RequestException as e:
        logger.error(f"Error saat request ke Etherscan API: {e}")
        raise HTTPException(status_code=503, detail=f"Error saat menghubungi Etherscan API: {e}")

@app.post("/analyze", response_model=FinalResponse, summary="Analisis Komprehensif Smart Contract")
async def analyze_contract(
    input_data: Dict[str, Any] = Body(...)
):

    token_address = None
    file_path = None
    try:
        token_address = input_data["contract_metadata"]["token_address"]
        solidity_version = input_data.get("contract_metadata", {}).get("solidity_version", "0.8.24").lstrip('^')
    except KeyError:
        raise HTTPException(status_code=400, detail="Input JSON tidak valid: 'contract_metadata.token_address' tidak ditemukan.")

    source_code = fetch_source_code_from_etherscan(token_address)

    tmp_file_path = ""
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".sol", delete=False, encoding='utf-8') as tmp_file:
            tmp_file.write(source_code)
            tmp_file_path = tmp_file.name
        
        logger.info(f"Source code disimpan sementara di: {tmp_file_path}")

        logger.info("Memulai analisis statis dan LLM secara paralel...")
        static_task = static_analyzer.run_analysis(tmp_file_path, solidity_version)
        llm_task = llm_analyzer.run_analysis(input_data)

        results = await asyncio.gather(static_task, llm_task, return_exceptions=True)

        static_report = results[0]
        llm_report = results[1]

        if isinstance(static_report, Exception):
            logger.error(f"Analisis statis gagal: {static_report}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Analisis statis gagal: {str(static_report)}")
        
        if isinstance(llm_report, Exception):
            logger.error(f"Analisis LLM gagal: {llm_report}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Analisis LLM gagal: {str(llm_report)}")

        logger.info("Kedua analisis berhasil diselesaikan.")

        return FinalResponse(
            metadata=AnalysisMetadata(file_path=file_path, token_address=token_address),
            static_analysis_report=static_report,
            llm_contextual_report=llm_report
        )

    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)
            logger.info(f"File temporer {tmp_file_path} telah dihapus.")

@app.get("/", summary="Health Check")
def read_root():
    return {"status": "Analyzer service is running."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)