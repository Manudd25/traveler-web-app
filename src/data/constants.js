export const BOOKING_TYPES = {
  CINEMA: "cinema",
  RESTAURANT: "restaurant",
  ACTIVITY: "activity",
};

export const ITINERARY_CATEGORIES = [
  "flight",
  "accommodation",
  "restaurant",
  "cinema",
  "attraction",
  "transport",
  "activity",
];

export const EXPENSE_CATEGORIES = [
  "flights",
  "accommodation",
  "food",
  "transportation",
  "activities",
  "shopping",
  "other",
];

export const DOCUMENT_TYPES = [
  "flight confirmation",
  "hotel reservation",
  "insurance",
  "event ticket",
  "travel document",
  "other",
];

export const DEMO_DISCLAIMER = "Demo booking — no real reservation will be made.";

export const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
