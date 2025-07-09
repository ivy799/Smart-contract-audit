from fastapi import FastAPI, UploadFile, File, HTTPException
from app.utils import ast_parser, etherscan
import os
import tempfile
import uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

TEMP_SOL_DIR = "temp_uploads"
os.makedirs(TEMP_SOL_DIR, exist_ok=True)

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")


@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    if not file.filename.endswith('.sol'):
        raise HTTPException(status_code=400, detail="Only .sol files are allowed")
    
    contents = await file.read()
    file_id = str(uuid.uuid4())
    
    temp_stored_path = os.path.join(TEMP_SOL_DIR, f"{file_id}_{file.filename}")
    
    try:
        with open(temp_stored_path, 'wb') as f:
            f.write(contents)

        original_content = contents.decode('utf-8')
        
        additional_metadata = {
            "token_address": None,  
            "contract_name": None,  
            "file_path": temp_stored_path,  
            "original_filename": file.filename,
            "upload_session_id": file_id
        }
        
        ast_result = ast_parser.parse_ast(original_content, additional_metadata)
        
        if os.path.exists(temp_stored_path):
            os.unlink(temp_stored_path)
            print(f"DEBUG: Cleaned up temporary file: {temp_stored_path}")

        if not ast_result["success"]:
            raise HTTPException(status_code=400, detail=f"AST parsing failed: {ast_result['error']}")

        return {
            "success": ast_result["success"],
            "ast": ast_result["ast"],
            "warnings": ast_result["warnings"],
            "removed_imports": ast_result["removed_imports"],
            "contract_metadata": ast_result["contract_metadata"]
        }

    except UnicodeDecodeError:
        if os.path.exists(temp_stored_path):
            os.unlink(temp_stored_path)
        raise HTTPException(status_code=400, detail="Invalid file encoding. Please ensure the file is UTF-8 encoded.")
    except Exception as e:
        if os.path.exists(temp_stored_path):
            os.unlink(temp_stored_path)
            print(f"DEBUG: Cleaned up temporary file due to error: {temp_stored_path}")
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
            "contract_name": contract_data["contract_name"],  
            "file_path": f"etherscan/{address}.sol"  
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