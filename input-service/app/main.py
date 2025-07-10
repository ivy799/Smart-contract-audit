import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.utils import ast_parser, etherscan
from azure.storage.blob import BlobServiceClient
from azure.storage.blob import generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")

blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(AZURE_CONTAINER_NAME)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_SOL_DIR = "temp_uploads"
os.makedirs(TEMP_SOL_DIR, exist_ok=True)

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")

# Add Pydantic model for the address request
class AddressRequest(BaseModel):
    address: str

@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    if not file.filename.endswith('.sol'):
        raise HTTPException(status_code=400, detail="Only .sol files are allowed")
    
    contents = await file.read()
    file_id = str(uuid.uuid4())
    
    temp_stored_path = os.path.join(TEMP_SOL_DIR, f"{file_id}_{file.filename}")
    
    try:
        blob_name = f"{file_id}_{file.filename}"
        blob_client = container_client.get_blob_client(blob_name)
        blob_client.upload_blob(contents, overwrite=True)

        sas_token = generate_blob_sas(
            account_name=blob_service_client.account_name,
            container_name=AZURE_CONTAINER_NAME,
            blob_name=blob_name,
            account_key=blob_service_client.credential.account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.utcnow() + timedelta(hours=1),  
        )

        blob_url_with_sas = f"https://{blob_service_client.account_name}.blob.core.windows.net/{AZURE_CONTAINER_NAME}/{blob_name}?{sas_token}"

        original_content = contents.decode('utf-8')

        additional_metadata = {
            "token_address": None,
            "contract_name": None,
            "file_path": blob_url_with_sas, 
        }

        ast_result = ast_parser.parse_ast(original_content, additional_metadata)

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

# Change this to POST to match your frontend request
@app.post("/contract-from-address")
async def get_contract(request: AddressRequest):
    try:
        print(f"DEBUG: Fetching contract from address: {request.address}")
        contract_data = etherscan.get_contract_source(request.address, ETHERSCAN_API_KEY)

        if not contract_data["source_code"]:
            raise HTTPException(status_code=404, detail="Contract source not found or not verified")

        print("DEBUG: Starting AST parsing...")
        
        additional_metadata = {
            "token_address": request.address, 
            "contract_name": contract_data["contract_name"],  
            "file_path": f"etherscan/{request.address}.sol"  
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

# Keep the GET version as well for backward compatibility
@app.get("/contract-from-address")
async def get_contract_get(address: str):
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