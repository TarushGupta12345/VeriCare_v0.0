from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
import os
from samplepipeline import (
    process_bill_image,
    identify_clerical_errors,
    identify_clerical_errors_pdf,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-bill")
def analyze_bill(file: UploadFile = File(...)):
    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name
        ext = os.path.splitext(temp_path)[1].lower()
        if ext == ".pdf":
            images = process_bill_image(temp_path)
            result = identify_clerical_errors_pdf(images)
        else:
            image = process_bill_image(temp_path)
            result = identify_clerical_errors(image)
        os.remove(temp_path)
        return {"analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
