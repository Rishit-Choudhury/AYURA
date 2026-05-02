from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ocr_service import extract_text_from_image
from medicine_service import find_generic_alternatives, build_comparison

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
    result = find_generic_alternatives(extracted_text)

    # Build comparison for each medicine found
    comparisons = []
    for alt in result.get("alternatives", []):
        comparison = build_comparison(alt)
        comparisons.append(comparison)

    return {
        "extracted_text": extracted_text,
        "alternatives": result.get("alternatives", []),
        "comparisons": comparisons,
        "medicines_found": result.get("medicines_found", []),
        "source": result.get("source", "")
    }