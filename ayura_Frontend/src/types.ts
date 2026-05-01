export interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  activeIngredients: string[];
  dosage: string;
  price: number;
  isGeneric: boolean;
  category: string;
  rating: number;
  reviewsCount: number;
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
