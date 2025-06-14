from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
import os
import traceback
from samplepipeline import (
    process_bill_image,
    transcribe_bill_image,
    transcribe_bill_pdf,
    analyze_with_web_search,
)

app = FastAPI()

# Enable CORS for all origins (you can restrict this later)
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
        # Save uploaded file to a temporary location
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        print(f"[INFO] Uploaded file saved to: {temp_path}")

        ext = os.path.splitext(temp_path)[1].lower()

        if ext == ".pdf":
            images = process_bill_image(temp_path)
            print(f"[INFO] Extracted {len(images)} image(s) from PDF")
            combined_text = transcribe_bill_pdf(images)
        else:
            image = process_bill_image(temp_path)
            print("[INFO] Extracting text from single image...")
            combined_text = transcribe_bill_image(image)

        os.remove(temp_path)
        print("[INFO] Temp file deleted")

        print("[INFO] Running web-enhanced analysis...")
        result = analyze_with_web_search(combined_text)

        print("[INFO] Analysis complete")
        return {
            "analysis": result,
            "raw_text": combined_text
        }

    except Exception as e:
        print("❌ Error during analysis:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")
