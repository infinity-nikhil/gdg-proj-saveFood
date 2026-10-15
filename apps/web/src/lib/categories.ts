import { CATEGORY_LABELS, type Category } from "@morsel/shared";
import { Apple, Croissant, CookingPot, Milk, Package, Wheat, type LucideIcon } from "lucide-react";

interface CategoryStyle {
  label: string;
  icon: LucideIcon;
  tint: string;
  accent: string;
}

export const categoryStyles: Record<Category, CategoryStyle> = {
  PRODUCE: { label: CATEGORY_LABELS.PRODUCE, icon: Apple, tint: "bg-forest-50", accent: "text-forest-600" },
  BAKERY: { label: CATEGORY_LABELS.BAKERY, icon: Croissant, tint: "bg-sun-100", accent: "text-sun-600" },
  DAIRY: { label: CATEGORY_LABELS.DAIRY, icon: Milk, tint: "bg-sky-50", accent: "text-sky-600" },
  PREPARED: { label: CATEGORY_LABELS.PREPARED, icon: CookingPot, tint: "bg-tomato-50", accent: "text-tomato-600" },
  PANTRY: { label: CATEGORY_LABELS.PANTRY, icon: Wheat, tint: "bg-amber-50", accent: "text-amber-700" },
  OTHER: { label: CATEGORY_LABELS.OTHER, icon: Package, tint: "bg-stone-100", accent: "text-stone-600" },
};
