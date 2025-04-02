
import React, { useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#D6BCFA", "#1A1F2C", "#8E9196"];

const Analytics: React.FC = () => {
  const { items } = useInventory();

  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { count: number; value: number }>();
    
    items.forEach(item => {
      const category = item.category;
      const current = categoryMap.get(category) || { count: 0, value: 0 };
      
      categoryMap.set(category, {
        count: current.count + item.quantity,
        value: current.value + (item.price * item.quantity)
      });
    });
    
    return Array.from(categoryMap.entries()).map(([name, data], index) => ({
      name,
      quantity: data.count,
      value: data.value,
      color: COLORS[index % COLORS.length]
    }));
  }, [items]);

  const priceRangeData = useMemo(() => {
    const ranges = [
      { range: "$0-$10", min: 0, max: 10, count: 0 },
      { range: "$10-$50", min: 10, max: 50, count: 0 },
      { range: "$50-$100", min: 50, max: 100, count: 0 },
      { range: "$100-$500", min: 100, max: 500, count: 0 },
      { range: "$500+", min: 500, max: Infinity, count: 0 }
    ];
    
    items.forEach(item => {
      const range = ranges.find(r => item.price >= r.min && item.price < r.max);
      if (range) range.count += item.quantity;
    });
    
    return ranges;
  }, [items]);

  const topValueItems = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, 5)
      .map(item => ({
        name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
        fullName: item.name,
        value: item.price * item.quantity
      }));
  }, [items]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View insights and analytics about your inventory
        </p>
      </div>

      <Tabs defaultValue="category">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="category">Category Analysis</TabsTrigger>
          <TabsTrigger value="price">Price Analysis</TabsTrigger>
          <TabsTrigger value="value">Value Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="category">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Items by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                    <Legend />
                    <Bar dataKey="quantity" fill="#9b87f5" name="Quantity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Value by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Value']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="price">
          <Card>
            <CardHeader>
              <CardTitle>Items by Price Range</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceRangeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                  <Legend />
                  <Bar dataKey="count" fill="#9b87f5" name="Number of Items" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="value">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Items by Total Value</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topValueItems}
                  layout="vertical"
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Total Value']}
                    labelFormatter={(label) => {
                      const item = topValueItems.find(item => item.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Bar dataKey="value" fill="#9b87f5" name="Total Value" barSize={20} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
