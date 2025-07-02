from fastapi import FastAPI, UploadFile, File, HTTPException
from utils import file_formatter, ast_parser
import os
import tempfile

app = FastAPI()

@app.post("/upload")
async def upload_contract(file: UploadFile = File(...)):
    if not file.filename.endswith('.sol'):
        raise HTTPException(status_code=400, detail="Only .sol files are allowed")
    
    contents = await file.read()
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
            "formatted": formatted,
            "ast": ast_result["ast"],
            "compiled_output": ast_result["compiled_output"]
        }
        
    except Exception as e:
        if os.path.exists(filepath):
            os.unlink(filepath)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

