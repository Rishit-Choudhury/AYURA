export interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  activeIngredients: string[];
  composition?: string;
  dosage: string;
  price: number;
  isGeneric: boolean;
  category: string;
  therapeutic_class?: string;
  rating: number;
  reviewsCount: number;
  side_effects?: string[];
  uses?: string[];
  clinicalNotes?: string;
  notes?: string;
  buy_links?: string[];
}

export interface ComparisonResult {
  originalMedicine: Medicine;
  genericAlternatives: Medicine[];
  totalSavingsPercent: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}
