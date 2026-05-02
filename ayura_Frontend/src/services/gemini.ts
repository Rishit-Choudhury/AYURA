import { ComparisonResult } from "../types";

const BACKEND_URL = "http://localhost:8000";

export async function analyzeMedicine(
  input: string | { data: string; mimeType: string }
): Promise<ComparisonResult | null> {
  try {
    let response;

    if (typeof input === "string") {
      const blob = new Blob([input], { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", blob, "search.txt");
      response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
    } else {
      const base64 = input.data;
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: input.mimeType });
      const formData = new FormData();
      formData.append("file", blob, "prescription.jpg");
      response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
    }

    if (!response.ok) throw new Error("Backend error");
    const data = await response.json();
    console.log("BACKEND DATA:", JSON.stringify(data));

    try {
      const result = mapToComparisonResult(data);
      console.log("MAPPED RESULT:", result);
      return result;
    } catch (e) {
      console.error("MAP ERROR:", e);
      return null;
    }

  } catch (err) {
    console.error("Backend call failed:", err);
    return null;
  }
}

function mapToComparisonResult(data: any): ComparisonResult | null {
  const medicineResults = data.medicine_results || [];
  console.log("medicine_results length:", medicineResults.length);
  
  if (medicineResults.length === 0) return null;

  const firstFound = medicineResults.find((m: any) => m.found && m.data) || medicineResults[0];
  const firstData = firstFound?.data || {};

  const originalMedicine = {
    id: "orig-1",
    name: firstData.brand_name || "Prescribed Medicine",
    manufacturer: "As Prescribed",
    activeIngredients: firstData.composition ? [firstData.composition] : ["Active Ingredient"],
    dosage: firstData.jan_aushadhi_unit || "As directed",
    price: firstData.brand_price_inr || 0,
    category: firstData.therapeutic_class || "General",
    rating: 4.8,
    reviewsCount: 450,
    isGeneric: false,
  };

  const genericAlternatives = medicineResults.map((item: any, index: number) => {
    if (!item.found || !item.data) {
      return {
        id: `gen-${index}`,
        name: item.medicine_name,
        manufacturer: "Not Found",
        activeIngredients: ["—"],
        dosage: "—",
        price: 0,
        category: "—",
        rating: 0,
        reviewsCount: 0,
        isGeneric: true,
        notFound: true,
        substitutes: [],
        sideEffects: [],
        uses: [],
        buyLinks: [],
        janAushadhi: "",
        notes: "No data found in our database",
        savings: null,
      };
    }

    const alt = item.data;
    const comp = item.comparison;

    return {
      id: `gen-${index}`,
      name: alt.generic_alternative || alt.brand_name,
      manufacturer: "Jan Aushadhi / Generic",
      activeIngredients: alt.composition ? [alt.composition] : ["Same composition"],
      dosage: alt.jan_aushadhi_unit || "As directed",
      price: alt.generic_price_inr || 0,
      category: alt.therapeutic_class || "General",
      rating: 4.3,
      reviewsCount: 200,
      isGeneric: true,
      notFound: false,
      brandName: alt.brand_name,
      brandPrice: alt.brand_price_inr || 0,
      substitutes: alt.substitutes || [],
      sideEffects: alt.side_effects || [],
      uses: alt.uses || [],
      buyLinks: alt.buy_links || [],
      janAushadhi: alt.jan_aushadhi || alt.notes || "",
      notes: alt.notes || "",
      savings: comp?.savings || null,
    };
  });

  const totalSavingsPercent = medicineResults
    .filter((m: any) => m.found && m.data)
    .reduce((max: number, m: any) => Math.max(max, m.data?.savings_percent || 0), 0);

  console.log("originalMedicine:", originalMedicine);
  console.log("genericAlternatives count:", genericAlternatives.length);
  console.log("totalSavingsPercent:", totalSavingsPercent);

  return {
    originalMedicine,
    genericAlternatives,
    totalSavingsPercent,
  };
}