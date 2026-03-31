export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit_type: string;
  current_stock_level: number;
  max_stock_level: number;
  daily_burn_rate: number;
  last_restock_date: string;
  created_at?: string;
}

export type Category =
  | "Produce"
  | "Dairy"
  | "Protein"
  | "Grains"
  | "Beverages"
  | "Snacks"
  | "Condiments"
  | "Frozen"
  | "Other";

export const CATEGORIES: Category[] = [
  "Produce",
  "Dairy",
  "Protein",
  "Grains",
  "Beverages",
  "Snacks",
  "Condiments",
  "Frozen",
  "Other",
];

export const UNIT_TYPES = [
  "bags",
  "lbs",
  "oz",
  "gallons",
  "liters",
  "bottles",
  "cans",
  "boxes",
  "packs",
  "units",
];
