
import React, { createContext, useContext, useState, useEffect } from "react";
import { InventoryItem, DEFAULT_CATEGORIES } from "@/types/inventory";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: string, item: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>) => void;
  deleteItem: (id: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

interface InventoryProviderProps {
  children: React.ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const savedItems = localStorage.getItem("inventoryItems");
    if (savedItems) {
      try {
        // Parse dates back to Date objects
        const parsedItems = JSON.parse(savedItems);
        return parsedItems.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      } catch (error) {
        console.error("Error parsing inventory items from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem("inventoryCategories");
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch (error) {
        console.error("Error parsing categories from localStorage:", error);
        return DEFAULT_CATEGORIES;
      }
    }
    return DEFAULT_CATEGORIES;
  });

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(items));
  }, [items]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("inventoryCategories", JSON.stringify(categories));
  }, [categories]);

  const addItem = (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newItem: InventoryItem = {
      ...item,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setItems((prevItems) => [...prevItems, newItem]);
    toast.success("Item added successfully");
  };

  const updateItem = (id: string, updatedFields: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, ...updatedFields, updatedAt: new Date() }
          : item
      )
    );
    toast.success("Item updated successfully");
  };

  const deleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
      toast.success(`Category "${category}" added successfully`);
    } else {
      toast.error("Category already exists");
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        categories,
        addCategory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
