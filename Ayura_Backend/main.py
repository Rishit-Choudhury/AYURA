from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ocr_service import extract_text_from_image
from medicine_service import find_generic_alternatives, build_result, build_comparison

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
    
    # Check if text file or image
    is_text = file.filename.endswith(".txt") or file.content_type == "text/plain"
    extracted_text = extract_text_from_image(image_bytes, is_text=is_text)

    if not extracted_text:
        return {
            "extracted_text": "",
            "medicines_found": [],
            "medicine_results": [],
            "source": "error"
        }

    result = find_generic_alternatives(extracted_text)
    medicines_found = result.get("medicines_found", [])
    alternatives = result.get("alternatives", [])

    medicine_results = []
    for medicine_name in medicines_found:
        match = next((a for a in alternatives
                      if a.get("brand_name", "").lower() == medicine_name.lower()), None)
        if match:
            medicine_results.append({
                "medicine_name": medicine_name,
                "found": True,
                "data": match,
                "comparison": build_comparison(match)
            })
        else:
            medicine_results.append({
                "medicine_name": medicine_name,
                "found": False,
                "data": None,
                "comparison": None
            })

    return {
        "extracted_text": extracted_text,
        "medicines_found": medicines_found,
        "medicine_results": medicine_results,
        "source": result.get("source", "")
    }