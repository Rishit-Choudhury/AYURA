import os
import json
import time # Added for retry logic
from google import genai
from google.genai import types, errors # Added errors
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def find_generic_alternatives(extracted_text: str) -> dict:
    prompt = f"""
    From this prescription text, find all medicine names.
    For each medicine, search the web and find:
    1. Generic name and composition
    2. Cheaper generic alternatives available in India
    3. Approximate prices (brand vs generic) in INR
    4. Where to buy online in India (1mg, netmeds, pharmeasy links)
    
    Prescription text:
    {extracted_text}
    """

    # Added retry loop for the "Limit 0" issue
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    temperature=0.1,
                    # Forces the model to return valid JSON without markdown backticks
                    response_mime_type="application/json",
                    response_schema={
                        "type": "OBJECT",
                        "properties": {
                            "medicines_found": {"type": "ARRAY", "items": {"type": "STRING"}},
                            "alternatives": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "brand_name": {"type": "STRING"},
                                        "composition": {"type": "STRING"},
                                        "generic_alternative": {"type": "STRING"},
                                        "brand_price_inr": {"type": "NUMBER"},
                                        "generic_price_inr": {"type": "NUMBER"},
                                        "savings_percent": {"type": "NUMBER"},
                                        "buy_links": {"type": "ARRAY", "items": {"type": "STRING"}},
                                        "notes": {"type": "STRING"}
                                    }
                                }
                            }
                        }
                    }
                )
            )
            return response.parsed # SDK automatically parses JSON when schema is provided
            
        except errors.ClientError as e:
            if "429" in str(e):
                print(f"Provisioning in progress (Limit 0). Waiting 30s... Attempt {attempt+1}")
                time.sleep(30)
            else:
                raise e

    return {"error": "Quota limit still active after retries. Please wait 15 minutes."}