import os
import json
import sqlite3
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
    ja = search_jan_aushadhi(medicine_name)
    brand = search_brand_db(medicine_name)
    sub_info = search_substitutes(medicine_name)

    if brand_price == 0 and brand:
        brand_price = brand[0]["price"]

    ja_price = ja[0]["mrp"] if ja else 0
    ja_name = ja[0]["generic_name"] if ja else "Not in Jan Aushadhi"
    ja_unit = ja[0]["unit_size"] if ja else ""

    savings = round(((brand_price - ja_price) / brand_price * 100)) if brand_price > 0 and ja_price > 0 else 0

    return {
        "found": len(ja) > 0,
        "brand_name": medicine_name.title(),
        "composition": brand[0]["composition"] if brand else "",
        "generic_alternative": ja_name,
        "brand_price_inr": brand_price,
        "generic_price_inr": ja_price,
        "savings_percent": savings,
        "jan_aushadhi_unit": ja_unit,
        "substitutes": sub_info.get("substitutes", []),
        "side_effects": sub_info.get("side_effects", []),
        "uses": sub_info.get("uses", []),
        "therapeutic_class": sub_info.get("therapeutic_class", ""),
        "buy_links": [
            f"https://www.1mg.com/search/all?name={medicine_name.replace(' ', '+')}",
            f"https://pharmeasy.in/search/all?name={medicine_name.replace(' ', '+')}"
        ],
        "notes": f"Available at Jan Aushadhi Kendra for ₹{ja_price} per {ja_unit}" if ja_price else "Check Jan Aushadhi store"
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

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.1)
        )

        clean = response.text.strip().replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean)
        medicines = parsed.get("medicines", [])

        alternatives = [build_result(m) for m in medicines]

        return {
            "medicines_found": medicines,
            "alternatives": alternatives,
            "source": "gemini+local_db"
        }

    except Exception:
        return local_search(extracted_text)

def build_comparison(alt: dict) -> dict:
    brand_price = alt.get("brand_price_inr", 0)
    generic_price = alt.get("generic_price_inr", 0)
    savings_amount = round(brand_price - generic_price, 2)
    savings_pct = alt.get("savings_percent", 0)

    monthly_brand = round(brand_price * 3, 2)
    monthly_generic = round(generic_price * 3, 2)
    monthly_savings = round(monthly_brand - monthly_generic, 2)

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
            "available_at": "Jan Aushadhi Kendra (Govt Store)",
            "substitutes": alt.get("substitutes", []),
            "buy_links": alt.get("buy_links", []),
        },
        "savings": {
            "per_unit_inr": savings_amount,
            "per_month_inr": monthly_savings,
            "percent": savings_pct,
            "verdict": (
                "🟢 High savings — switch recommended" if savings_pct >= 50 else
                "🟡 Moderate savings — consider switching" if savings_pct >= 20 else
                "🔵 Low savings — your choice"
            )
        }
    }