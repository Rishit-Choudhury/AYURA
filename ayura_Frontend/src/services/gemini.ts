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
      const byteString = atob(input.data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: input.mimeType });
      const formData = new FormData();
      formData.append("file", blob, "prescription.jpg");
      response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
    }

    if (!response.ok) throw new Error("Backend error");
    const data = await response.json();
    return mapToComparisonResult(data);

  } catch (err) {
    console.error("Backend call failed:", err);
    return null;
  }
}

function mapToComparisonResult(data: any): ComparisonResult | null {
  const alternatives = data.alternatives || [];
  const comparisons = data.comparisons || [];

  if (alternatives.length === 0 && comparisons.length === 0) return null;

  const first = alternatives[0] || {};
  const firstComp = comparisons[0] || {};

  const originalMedicine = {
    id: "orig-1",
    name: first.brand_name || "Prescribed Medicine",
    manufacturer: "As Prescribed",
    activeIngredients: first.composition ? [first.composition] : ["Active Ingredient"],
    dosage: first.jan_aushadhi_unit || "As directed",
    price: first.brand_price_inr || 0,
    category: first.therapeutic_class || "General",
    rating: 4.8,
    reviewsCount: 450,
    isGeneric: false,
  };

  const genericAlternatives = alternatives.map((alt: any, index: number) => ({
    id: `gen-${index}`,
    name: alt.generic_alternative || alt.brand_name,
    manufacturer: "Jan Aushadhi / Generic",
    activeIngredients: alt.composition ? [alt.composition] : ["Same composition"],
    dosage: alt.jan_aushadhi_unit || "As directed",
    price: alt.generic_price_inr || 0,
    category: alt.therapeutic_class || "General",
    rating: 4.3 + index * 0.1,
    reviewsCount: 200 + index * 50,
    isGeneric: true,
    substitutes: alt.substitutes || [],
    sideEffects: alt.side_effects || [],
    uses: alt.uses || [],
    buyLinks: alt.buy_links || [],
    janAushadhi: alt.jan_aushadhi || "",
    notes: alt.notes || "",
    savings: firstComp.savings || null,
  }));

  const totalSavingsPercent =
    alternatives[0]?.savings_percent ||
    comparisons[0]?.savings?.percent ||
    0;

  return {
    originalMedicine,
    genericAlternatives,
    totalSavingsPercent,
  };
}