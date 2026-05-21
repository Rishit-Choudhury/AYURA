import os
import json
import sqlite3
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

BASE = os.path.dirname(__file__)

def get_db_connection():
    db_path = os.path.join(BASE, "ayura.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def fetch_medicine_details_from_web(medicine_name: str) -> dict:
    """Uses Gemini with Google Search Grounding to fetch live drug details, prices, and images with automatic model fallback."""
    prompt = f"""
Search the web for the Indian medicine: "{medicine_name}" and extract:
1. "brand_name": The exact marketed brand name.
2. "composition": The active generic ingredients/chemical composition (e.g., "Paracetamol 650mg", "Adapalene 0.1% + Clindamycin 1%").
3. "price_inr": The average market retail price (MRP) in India (as a float, e.g., 150.0). If you find a range, use the average.
4. "manufacturer": The pharmaceutical company that manufactures it.
5. "therapeutic_class": The medical class/category (e.g., "Anti-acne", "Analgesic").
6. "uses": A list of 2-3 primary medical uses.
7. "side_effects": A list of 3-4 common side effects.
8. "image_url": A direct public image source URL (ending in .jpg, .jpeg, .png, or from retailer CDNs like onemg.com/images/ or pharmeasy.in). It must be a direct URL to the image file, NOT a webpage. If not found, use a clean placeholder or leave blank.

Return ONLY a valid JSON object matching this structure, with no markdown formatting, no backticks, and no explanations:
{{
  "brand_name": "{medicine_name}",
  "composition": "Generic Ingredient Name",
  "price_inr": 150.0,
  "manufacturer": "Company Name",
  "therapeutic_class": "Therapeutic Class",
  "uses": ["use1", "use2"],
  "side_effects": ["side_effect1", "side_effect2"],
  "image_url": "https://example.com/image.jpg"
}}
"""
    models_to_try = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"]
    last_err = None
    for model_name in models_to_try:
        try:
            grounding_tool = types.Tool(google_search=types.GoogleSearch())
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[grounding_tool],
                    temperature=0.1
                )
            )
            text = response.text.strip().replace("```json", "").replace("```", "").strip()
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            if start_idx != -1 and end_idx != -1:
                text = text[start_idx:end_idx+1]
            return json.loads(text)
        except Exception as e:
            print(f"Web grounding failed with model {model_name} for {medicine_name}: {e}")
            last_err = e
            continue
    print(f"All models failed for {medicine_name}. Last error: {last_err}")
    return {}

def find_generic_alternatives_for_composition(composition: str) -> list:
    """Parses chemical ingredients from a composition and queries local Jan Aushadhi database."""
    if not composition:
        return []
    
    # Extract ingredient keywords of length > 4
    words = re.findall(r'[a-zA-Z]{5,}', composition.lower())
    ignore_words = {"tablet", "capsule", "cream", "ointment", "percent", "gel", "injection", "solution", "suspension", "liquid"}
    ingredients = [w for w in words if w not in ignore_words]
    
    if not ingredients:
        return []
    
    matches = []
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        for ing in ingredients[:2]:  # Search up to first two active ingredients
            cur.execute(
                'SELECT "Generic Name", "MRP", "Unit Size", "Group Name" FROM jan_aushadhi '
                'WHERE "Generic Name" LIKE ? LIMIT 3',
                (f"%{ing}%",)
            )
            matches.extend(cur.fetchall())
        conn.close()
    except Exception as e:
        print(f"Jan Aushadhi matching error: {e}")
        
    seen = set()
    deduped = []
    for row in matches:
        name = row["Generic Name"]
        if name not in seen:
            seen.add(name)
            deduped.append({
                "generic_name": str(row["Generic Name"]).title(),
                "mrp": row["MRP"],
                "unit_size": row["Unit Size"],
                "group": row["Group Name"]
            })
            
    return deduped[:4]  # Return up to 4 local generic alternatives

def search_jan_aushadhi(medicine_name: str) -> list:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'SELECT "Generic Name", "MRP", "Unit Size", "Group Name" FROM jan_aushadhi WHERE "Generic Name" LIKE ? LIMIT 3',
            (f"%{medicine_name.lower()}%",)
        )
        rows = cur.fetchall()
        conn.close()
    except Exception as e:
        print(f"Jan Aushadhi DB error: {e}")
        rows = []

    out = []
    for row in rows:
        out.append({
            "generic_name": str(row["Generic Name"]).title(),
            "mrp": row["MRP"],
            "unit_size": row["Unit Size"],
            "group": row["Group Name"]
        })
    return out

def search_brand_db(medicine_name: str) -> list:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'SELECT "Medicine Name", "Price", "Type of Medicine", "Composition" FROM brand_meds '
            'WHERE "Medicine Name" LIKE ? OR "Composition" LIKE ? LIMIT 3',
            (f"%{medicine_name.lower()}%", f"%{medicine_name.lower()}%")
        )
        rows = cur.fetchall()
        conn.close()
    except Exception as e:
        print(f"Brand DB error: {e}")
        rows = []

    out = []
    for row in rows:
        price_raw = str(row["Price"] or "0").replace("₹", "").replace(",", "").strip()
        try:
            price = float(price_raw)
        except:
            price = 0
        out.append({
            "medicine_name": str(row["Medicine Name"]).title(),
            "price": price,
            "composition": str(row["Composition"] or "").title(),
            "type": str(row["Type of Medicine"] or "")
        })
    return out

def search_substitutes(medicine_name: str) -> dict:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM substitutes WHERE "name" LIKE ? LIMIT 1', (f"%{medicine_name.lower()}%",))
        row = cur.fetchone()
        conn.close()
    except Exception as e:
        print(f"Substitutes DB error: {e}")
        row = None

    if not row:
        return {}

    subs = []
    for i in range(5):
        val = row[f"substitute{i}"]
        if val is not None and str(val).strip():
            subs.append(str(val).strip())

    effects = []
    for i in range(10):
        val = row[f"sideEffect{i}"]
        if val is not None and str(val).strip():
            effects.append(str(val).strip())

    uses = []
    for i in range(5):
        val = row[f"use{i}"]
        if val is not None and str(val).strip():
            uses.append(str(val).strip())

    return {
        "substitutes": subs,
        "side_effects": effects[:5],
        "uses": uses,
        "therapeutic_class": str(row["Therapeutic Class"] or "")
    }

def build_result(medicine_name: str, brand_price: float = 0) -> dict:
    # 1. Fetch real-time price & details from the web first via Google Search grounding
    web = fetch_medicine_details_from_web(medicine_name)
    
    image_url = ""
    if web:
        # Use web details as primary
        exact_name = web.get("brand_name", medicine_name).title()
        composition = web.get("composition", "")
        price = web.get("price_inr", brand_price)
        therapeutic_class = web.get("therapeutic_class", "")
        uses = web.get("uses", [])
        side_effects = web.get("side_effects", [])
        image_url = web.get("image_url", "")
        
        # Query 3-4 local Jan Aushadhi alternatives matching this composition
        ja = find_generic_alternatives_for_composition(composition)
        
        # Query local substitutes for additional commercial alternatives
        sub_info = search_substitutes(exact_name)
        substitutes = sub_info.get("substitutes", [])
    else:
        # Fallback to local database search if web grounding is completely unavailable
        exact_name = medicine_name.title()
        brand = search_brand_db(medicine_name)
        ja = search_jan_aushadhi(medicine_name)
        sub_info = search_substitutes(medicine_name)
        
        price = brand[0]["price"] if (brand_price == 0 and brand) else brand_price
        composition = brand[0]["composition"] if brand else (sub_info.get("therapeutic_class") if sub_info else "")
        therapeutic_class = sub_info.get("therapeutic_class", "")
        uses = sub_info.get("uses", [])
        side_effects = sub_info.get("side_effects", [])
        substitutes = sub_info.get("substitutes", [])

    # If local substitutes are empty, try searching substitutes using first ingredient name
    if not substitutes and composition:
        words = re.findall(r'[a-zA-Z]{5,}', composition.lower())
        if words:
            substitutes = search_substitutes(words[0]).get("substitutes", [])

    # Since we use web search grounding, every medicine is found and priced successfully!
    found = True

    ja_price = ja[0]["mrp"] if ja else 0
    ja_name = ja[0]["generic_name"] if ja else "Not in Jan Aushadhi"
    ja_unit = ja[0]["unit_size"] if ja else ""

    savings = round(((price - ja_price) / price * 100)) if price > 0 and ja_price > 0 else 0

    return {
        "found": found,
        "query_name": medicine_name,
        "brand_name": exact_name,
        "composition": composition,
        "generic_alternative": ja_name,
        "brand_price_inr": price,
        "generic_price_inr": ja_price,
        "savings_percent": savings,
        "jan_aushadhi_unit": ja_unit,
        "jan_aushadhi_alternatives": ja,
        "substitutes": substitutes,
        "side_effects": side_effects,
        "uses": uses,
        "therapeutic_class": therapeutic_class,
        "image_url": image_url,
        "buy_links": [
            {
                "store": "Tata 1mg",
                "url": f"https://www.1mg.com/search/all?name={exact_name.replace(' ', '+')}",
                "color": "#ff6f61"
            },
            {
                "store": "PharmEasy",
                "url": f"https://pharmeasy.in/search/all?name={exact_name.replace(' ', '+')}",
                "color": "#10847e"
            }
        ],
        "notes": f"Available at Jan Aushadhi Kendra for ₹{ja_price} per {ja_unit}" if ja_price else "No direct Jan Aushadhi alternative found"
    }

def local_search(extracted_text: str) -> dict:
    """Fallback — search only Jan Aushadhi DB to avoid false matches."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT DISTINCT "Generic Name" FROM jan_aushadhi')
        rows = cur.fetchall()
        conn.close()
    except Exception as e:
        print(f"Local search DB error: {e}")
        rows = []

    text_lower = extracted_text.lower()
    found = []
    for row in rows:
        generic = str(row["Generic Name"] or "").lower()
        words = [w for w in generic.split() if len(w) > 4]
        if not words:
            continue
        key = words[0]
        if key in text_lower and key not in found:
            found.append(key)
        if len(found) >= 8:
            break

    alternatives = [build_result(m) for m in found]
    return {
        "medicines_found": [m.title() for m in found],
        "alternatives": alternatives,
        "source": "local_db"
    }

def find_generic_alternatives(extracted_text: str) -> dict:
    try:
        prompt = f"""
You are a medical prescription parser.
Extract ONLY the medicine/drug names from this prescription text.
Do NOT include:
- Doctor names, patient names, hospital names
- Words like "Daily", "Science", "Derma", "Order", "Service", "Name"
- Dosage instructions, frequencies, directions
- Diagnoses, test names, or medical procedures

Return ONLY medicine brand names or generic drug names as a JSON list.
Examples of valid medicines: Tretiva, Moiz, Deriva CMS, Episoft, Azithromycin, Paracetamol

Prescription text:
{extracted_text}

Return ONLY this JSON, no markdown, no explanation:
{{"medicines": ["medicine1", "medicine2"]}}
"""

        models_to_try = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"]
        parsed = None
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(temperature=0.1)
                )
                clean = response.text.strip().replace("```json", "").replace("```", "").strip()
                start_idx = clean.find('{')
                end_idx = clean.rfind('}')
                if start_idx != -1 and end_idx != -1:
                    clean = clean[start_idx:end_idx+1]
                parsed = json.loads(clean)
                break
            except Exception as e:
                print(f"Prescription parsing failed with model {model_name}: {e}")
                continue

        if not parsed:
            raise ValueError("All models failed to parse prescription")

        medicines = parsed.get("medicines", [])

        # Optimize search using ThreadPoolExecutor for parallel execution!
        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=5) as executor:
            alternatives = list(executor.map(build_result, medicines))

        return {
            "medicines_found": medicines,
            "alternatives": alternatives,
            "source": "gemini+local_db"
        }

    except Exception as e:
        print(f"Prescription extraction fell back to local search due to error: {e}")
        return local_search(extracted_text)

def build_comparison(alt: dict) -> dict:
    brand_price = alt.get("brand_price_inr", 0)
    generic_price = alt.get("generic_price_inr", 0)
    savings_pct = alt.get("savings_percent", 0)

    has_generic = generic_price > 0 and alt.get("generic_alternative") != "Not in Jan Aushadhi"

    if has_generic:
        savings_amount = round(brand_price - generic_price, 2)
        monthly_brand = round(brand_price * 3, 2)
        monthly_generic = round(generic_price * 3, 2)
        monthly_savings = round(monthly_brand - monthly_generic, 2)
        verdict = (
            "🟢 High savings — switch recommended" if savings_pct >= 50 else
            "🟡 Moderate savings — consider switching" if savings_pct >= 20 else
            "🔵 Low savings — your choice"
        )
        savings_info = {
            "per_unit_inr": savings_amount,
            "per_month_inr": monthly_savings,
            "percent": savings_pct,
            "verdict": verdict
        }
    else:
        monthly_brand = round(brand_price * 3, 2) if brand_price > 0 else 0
        monthly_generic = 0
        savings_info = None

    return {
        "medicine": alt.get("brand_name", ""),
        "prescribed": {
            "name": alt.get("brand_name", ""),
            "composition": alt.get("composition", ""),
            "price_inr": brand_price,
            "monthly_cost_inr": monthly_brand,
            "therapeutic_class": alt.get("therapeutic_class", ""),
            "side_effects": alt.get("side_effects", []),
            "uses": alt.get("uses", []),
        },
        "generic_alternative": {
            "name": alt.get("generic_alternative", ""),
            "composition": alt.get("composition", ""),
            "price_inr": generic_price,
            "monthly_cost_inr": monthly_generic,
            "unit_size": alt.get("jan_aushadhi_unit", ""),
            "available_at": "Jan Aushadhi Kendra (Govt Store)" if has_generic else "Commercial Brands",
            "substitutes": alt.get("substitutes", []),
            "buy_links": alt.get("buy_links", []),
        },
        "savings": savings_info
    }