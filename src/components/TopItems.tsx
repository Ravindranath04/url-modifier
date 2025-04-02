
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/context/InventoryContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const TopItems: React.FC = () => {
  const { items } = useInventory();

  const topItems = useMemo(() => {
    return [...items]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(item => ({
        name: item.name.length > 12 ? `${item.name.substring(0, 12)}...` : item.name,
        fullName: item.name,
        quantity: item.quantity
      }));
  }, [items]);

  if (topItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Stocked Items</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No inventory data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Stocked Items</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topItems}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip
              formatter={(value) => [`${value} units`, 'Quantity']}
              labelFormatter={(label) => {
                const item = topItems.find(item => item.name === label);
                return item ? item.fullName : label;
              }}
            />
            <Bar dataKey="quantity" fill="#9b87f5" barSize={20} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopItems;
