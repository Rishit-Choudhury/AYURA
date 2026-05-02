import os
import json
import pandas as pd
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

BASE = os.path.dirname(__file__)

print("Loading datasets...")

# 1. Jan Aushadhi
try:
    df_ja = pd.read_csv(os.path.join(BASE, "Product List_2_5_2026 @ 0_32_40.csv"), encoding="utf-8-sig")
    df_ja.columns = df_ja.columns.str.strip()
    df_ja["Generic Name"] = df_ja["Generic Name"].str.lower().str.strip()
    print(f"✅ Jan Aushadhi: {len(df_ja)} medicines")
except Exception as e:
    df_ja = pd.DataFrame()
    print(f"❌ Jan Aushadhi failed: {e}")

# 2. India Medicines
try:
    df_brand = pd.read_csv(os.path.join(BASE, "India Medicines and Drug Info Dataset.csv"), encoding="utf-8-sig", low_memory=False)
    df_brand.columns = df_brand.columns.str.strip()
    df_brand["Medicine Name"] = df_brand["Medicine Name"].str.lower().str.strip()
    df_brand["Composition"] = df_brand["Composition"].fillna("").str.lower().str.strip()
    print(f"✅ Brand DB: {len(df_brand)} medicines")
except Exception as e:
    df_brand = pd.DataFrame()
    print(f"❌ Brand DB failed: {e}")

# 3. Substitutes
try:
    df_sub = pd.read_csv(os.path.join(BASE, "med_daraset.csv"), encoding="utf-8-sig", low_memory=False)
    df_sub.columns = df_sub.columns.str.strip()
    df_sub["name"] = df_sub["name"].str.lower().str.strip()
    print(f"✅ Substitutes DB: {len(df_sub)} medicines")
except Exception as e:
    df_sub = pd.DataFrame()
    print(f"❌ Substitutes DB failed: {e}")

print("All datasets loaded.")


def search_jan_aushadhi(medicine_name: str) -> list:
    if df_ja.empty:
        return []
    mask = df_ja["Generic Name"].str.contains(medicine_name.lower(), na=False, regex=False)
    results = df_ja[mask].head(3)
    out = []
    for _, row in results.iterrows():
        out.append({
            "generic_name": str(row["Generic Name"]).title(),
            "mrp": row["MRP"],
            "unit_size": row["Unit Size"],
            "group": row["Group Name"]
        })
    return out


def search_brand_db(medicine_name: str) -> list:
    if df_brand.empty:
        return []
    name_lower = medicine_name.lower()
    mask = (df_brand["Medicine Name"].str.contains(name_lower, na=False, regex=False) |
            df_brand["Composition"].str.contains(name_lower, na=False, regex=False))
    results = df_brand[mask].head(3)
    out = []
    for _, row in results.iterrows():
        price_raw = str(row.get("Price", "0")).replace("₹", "").replace(",", "").strip()
        try:
            price = float(price_raw)
        except:
            price = 0
        out.append({
            "medicine_name": str(row["Medicine Name"]).title(),
            "price": price,
            "composition": str(row.get("Composition", "")).title(),
            "type": str(row.get("Type of Medicine", ""))
        })
    return out


def search_substitutes(medicine_name: str) -> dict:
    if df_sub.empty:
        return {}
    mask = df_sub["name"].str.contains(medicine_name.lower(), na=False, regex=False)
    results = df_sub[mask].head(1)
    if results.empty:
        return {}
    row = results.iloc[0]

    subs = []
    for i in range(5):
        val = row.get(f"substitute{i}", "")
        if pd.notna(val) and str(val).strip():
            subs.append(str(val).strip())

    effects = []
    for i in range(10):
        val = row.get(f"sideEffect{i}", "")
        if pd.notna(val) and str(val).strip():
            effects.append(str(val).strip())

    uses = []
    for i in range(5):
        val = row.get(f"use{i}", "")
        if pd.notna(val) and str(val).strip():
            uses.append(str(val).strip())

    return {
        "substitutes": subs,
        "side_effects": effects[:5],
        "uses": uses,
        "therapeutic_class": str(row.get("Therapeutic Class", ""))
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
    text_lower = extracted_text.lower()
    found = []
    if not df_brand.empty:
        for _, row in df_brand.iterrows():
            name = str(row["Medicine Name"]).lower()
            key = name.split()[0] if name else ""
            if key and len(key) > 4 and key in text_lower and key not in found:
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
        From this prescription text, identify all medicine names as a JSON list.
        Return ONLY this JSON, no markdown:
        {{"medicines": ["medicine1", "medicine2"]}}

        Prescription text:
        {extracted_text}
        """

        response = client.models.generate_content(
            model="gemini-1.5-flash",
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