
import React, { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import InventoryTable from "@/components/InventoryTable";
import AddItemForm from "@/components/AddItemForm";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Inventory: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage and view your inventory items
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start"
        >
          {showAddForm ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </>
          )}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <AddItemForm onSuccess={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}

      <InventoryTable />
    </div>
  );
};

export default Inventory;
