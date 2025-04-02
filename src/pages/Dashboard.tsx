
import React, { useMemo } from "react";
import { Package, DollarSign, ArrowUp, AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import LowStockItems from "@/components/LowStockItems";
import CategoryDistributionChart from "@/components/CategoryDistributionChart";
import TopItems from "@/components/TopItems";
import { useInventory } from "@/context/InventoryContext";
import { LOW_STOCK_THRESHOLD } from "@/types/inventory";

const Dashboard: React.FC = () => {
  const { items } = useInventory();

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalCategories = useMemo(() => {
    return new Set(items.map(item => item.category)).size;
  }, [items]);

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const lowStockCount = useMemo(() => {
    return items.filter(item => item.quantity <= LOW_STOCK_THRESHOLD).length;
  }, [items]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your inventory and key metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={<Package className="h-4 w-4" />}
          description="Total units in inventory"
        />
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={<ArrowUp className="h-4 w-4" />}
          description="Number of categories"
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          icon={<DollarSign className="h-4 w-4" />}
          description="Total value of inventory"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          description={`Items with quantity <= ${LOW_STOCK_THRESHOLD}`}
          className={lowStockCount > 0 ? "border-destructive" : ""}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CategoryDistributionChart />
        <TopItems />
      </div>

      <LowStockItems />
    </div>
  );
};

export default Dashboard;
