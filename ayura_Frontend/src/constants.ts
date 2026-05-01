import { Review } from "./types";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    userName: "Anjali S.",
    rating: 5,
    comment: "Saved ₹800 a month switching to the generic recommended here. The quality is exactly the same!",
    date: "2026-04-15",
    isVerified: true
  },
  {
    id: "2",
    userName: "Rahul M.",
    rating: 4,
    comment: "Very easy to use. Uploaded my prescription and got results in seconds. Verified Indian generics are a win.",
    date: "2026-04-10",
    isVerified: true
  },
  {
    id: "3",
    userName: "Priya V.",
    rating: 5,
    comment: "Ayura AI is a lifesaver. My monthly meds used to cost ₹2500, now they're under ₹900.",
    date: "2026-03-28",
    isVerified: true
  }
];

export const COLORS = {
  primary: "#2563eb", // Blue 600
  secondary: "#0f172a", // Slate 900
  accent: "#10b981", // Emerald 500
  background: "#f8fafc" // Slate 50
};
