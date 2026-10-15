export const ROLES = ["DONOR", "RECEIVER"] as const;

export const CATEGORIES = ["PRODUCE", "BAKERY", "DAIRY", "PREPARED", "PANTRY", "OTHER"] as const;

export const LISTING_STATUSES = ["AVAILABLE", "RESERVED", "COLLECTED", "EXPIRED"] as const;

export const CLAIM_STATUSES = ["PENDING", "COLLECTED", "CANCELLED"] as const;

export const UNITS = ["kg", "portions", "items", "boxes", "litres"] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  PRODUCE: "Fruit & Veg",
  BAKERY: "Bakery",
  DAIRY: "Dairy",
  PREPARED: "Cooked Meals",
  PANTRY: "Pantry",
  OTHER: "Other",
};

export const KG_PER_MEAL = 0.42;
export const CO2_PER_KG = 2.5;
export const WATER_LITRES_PER_KG = 1000;
