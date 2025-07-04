from fastapi import FastAPI, UploadFile, File, HTTPException
from utils import ast_parser, etherscan
import os
import tempfile
import uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

STORED_SOL_DIR = "uploaded_sols"
os.makedirs(STORED_SOL_DIR, exist_ok=True)

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")


@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    if not file.filename.endswith('.sol'):
        raise HTTPException(status_code=400, detail="Only .sol files are allowed")
    
    contents = await file.read()
    file_id = str(uuid.uuid4())
    
    stored_path = os.path.join(STORED_SOL_DIR, f"{file_id}.sol")
    with open(stored_path, 'wb') as f:
        f.write(contents)
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".sol") as tmp:
        tmp.write(contents)
        filepath = tmp.name

    try:
        original_content = contents.decode('utf-8')
        ast_result = ast_parser.parse_ast(original_content)
        
        os.unlink(filepath)

        if not ast_result["success"]:
            raise HTTPException(status_code=400, detail=f"AST parsing failed: {ast_result['error']}")

        return {
            "ast": ast_result["ast"],
            "file_path": stored_path,
            "warnings": ast_result.get("warnings", []),
            "removed_imports": ast_result.get("removed_imports", []),
            "solidity_version": ast_result.get("solidity_version")
        }

    except Exception as e:
        if os.path.exists(filepath):
            os.unlink(filepath)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.get("/contract-from-address")
async def get_contract(address: str):
    try:
        print(f"DEBUG: Fetching contract from address: {address}")
        contract_data = etherscan.get_contract_source(address, ETHERSCAN_API_KEY)

        if not contract_data["source_code"]:
            raise HTTPException(status_code=404, detail="Contract source not found or not verified")

        print("DEBUG: Starting AST parsing...")
        ast_result = ast_parser.parse_ast(contract_data["source_code"])

        if not ast_result["success"]:
            print(f"DEBUG: AST parsing failed: {ast_result['error']}")
            raise HTTPException(status_code=400, detail=f"AST parsing failed: {ast_result['error']}")

        return {
            "ast": ast_result["ast"],
            "token_address": address,
            "contract_name": contract_data["contract_name"],
            "solidity_version": ast_result.get("solidity_version"),
            "warnings": ast_result.get("warnings", []),
            "removed_imports": ast_result.get("removed_imports", [])
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve or process contract: {str(e)}")