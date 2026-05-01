from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ocr_service import extract_text_from_image
from medicine_service import find_generic_alternatives

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "Ayura backend running"}

@app.post("/api/upload")
async def upload_prescription(file: UploadFile = File(...)):
    image_bytes = await file.read()
    extracted_text = extract_text_from_image(image_bytes)
    alternatives = find_generic_alternatives(extracted_text)
    return {
        "extracted_text": extracted_text,
        "alternatives": alternatives
    }