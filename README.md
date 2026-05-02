# AYURA 💊

AYURA is an AI-powered web platform designed to help users discover affordable generic alternatives to branded medicines.

Users can:

- Search by medicine name
- Upload a prescription image

The system identifies the medicine, matches its composition using a medicine dataset, and suggests lower-cost generic alternatives.

---

## Problem Statement

Many patients purchase expensive branded medicines without knowing that cheaper generic alternatives with the same composition are available.

AYURA helps users make informed healthcare decisions by finding affordable alternatives quickly and easily.

---

## Features

✅ Search medicines by name  
✅ Upload prescription images  
✅ OCR-based text extraction  
✅ Generic medicine recommendations  
✅ Price comparison  
✅ Responsive and modern UI

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS

### Backend

- Python
- FastAPI

### Data Processing

- CSV datasets
- Pandas

### OCR

- Tesseract OCR

---

## How It Works

1. User enters a medicine name or uploads a prescription image.
2. Prescription text is extracted using OCR.
3. The backend processes the input.
4. Medicine information is matched against the CSV dataset.
5. Generic alternatives with lower prices are displayed.

---

## Dataset

Medicine data is stored in CSV format and includes:

- Brand Name
- Salt Composition
- Dosage
- Manufacturer
- Price

This dataset is used to find equivalent generic medicines and compare pricing.

---

### Clone Repository

git clone https://github.com/Rishit-Choudhury/AYURA

---

### Frontend Setup

npm install
npm run dev

---

### Backend Setup

cd backend
pip install fastapi uvicorn pandas pytesseract pillow

Run backend:

uvicorn main:app --reload

---

## Future Improvements

- Real-time medicine APIs
- Larger medicine datasets
- Better handwritten prescription recognition
- Nearby pharmacy recommendations

---

## Disclaimer

This platform is intended for informational purposes only.

Always consult a licensed doctor or pharmacist before switching medications.
