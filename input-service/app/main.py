from fastapi import FastAPI, UploadFile, File, HTTPException
from utils import file_formatter, ast_parser
import os
import tempfile
import uuid

app = FastAPI()

STORED_SOL_DIR = "uploaded_sols"
os.makedirs(STORED_SOL_DIR, exist_ok=True)

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
        formatted = file_formatter.format_file(filepath)
        ast_result = ast_parser.parse_ast(formatted)
        
        os.unlink(filepath)
        
        if not ast_result["success"]:
            raise HTTPException(status_code=400, detail=f"AST parsing failed: {ast_result['error']}")

        return {
            "file_id" : file_id,
            "file_name": file.filename,
            "ast": ast_result["ast"],
        }
        
    except Exception as e:
        if os.path.exists(filepath):
            os.unlink(filepath)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

