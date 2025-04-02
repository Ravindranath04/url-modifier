
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Furniture",
  "Office Supplies",
  "Other"
];

export const LOW_STOCK_THRESHOLD = 5;
