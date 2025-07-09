from fastapi import FastAPI, UploadFile, File, HTTPException
from app.utils import ast_parser, etherscan
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
        
        additional_metadata = {
            "file_path": stored_path
        }
        
        ast_result = ast_parser.parse_ast(original_content, additional_metadata)
        
        os.unlink(filepath)

        if not ast_result["success"]:
            raise HTTPException(status_code=400, detail=f"AST parsing failed: {ast_result['error']}")

        return {
            "success": ast_result["success"],
            "ast": ast_result["ast"],
            "warnings": ast_result["warnings"],
            "removed_imports": ast_result["removed_imports"],
            "contract_metadata": ast_result["contract_metadata"]
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
        
        additional_metadata = {
            "token_address": address,
            "contract_name": contract_data["contract_name"]
        }
        
        ast_result = ast_parser.parse_ast(contract_data["source_code"], additional_metadata)

        if not ast_result["success"]:
            print(f"DEBUG: AST parsing failed: {ast_result['error']}")
            raise HTTPException(status_code=400, detail=f"AST parsing failed: {ast_result['error']}")

        return {
            "success": ast_result["success"],
            "ast": ast_result["ast"],
            "warnings": ast_result["warnings"],
            "removed_imports": ast_result["removed_imports"],
            "contract_metadata": ast_result["contract_metadata"]
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve or process contract: {str(e)}")