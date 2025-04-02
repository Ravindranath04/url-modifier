
import React from "react";
import { useUrlShortener } from "@/context/UrlShortenerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const Analytics: React.FC = () => {
  const { urls } = useUrlShortener();

  // Sort URLs by clicks in descending order
  const sortedUrls = [...urls].sort((a, b) => b.clicks - a.clicks);
  const topUrls = sortedUrls.slice(0, 5);

  // Prepare data for charts
  const barChartData = topUrls.map(url => ({
    name: url.shortCode,
    clicks: url.clicks,
    url: url.originalUrl
  }));

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  // Calculate the age distribution of clicks
  const now = new Date();
  const clicksByAge = urls.reduce((acc, url) => {
    const ageInDays = Math.floor((now.getTime() - url.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const ageGroup = ageInDays < 1 ? 'Today' : 
                    ageInDays < 7 ? 'This Week' : 
                    ageInDays < 30 ? 'This Month' : 'Older';
    
    if (!acc[ageGroup]) acc[ageGroup] = 0;
    acc[ageGroup] += url.clicks;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(clicksByAge).map(([name, value]) => ({ name, value }));

  // Calculate when most clicks happen
  const urlsWithClicks = urls.filter(url => url.clicks > 0);

  // COLORS for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights about your shortened URLs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top URLs by Clicks */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top URLs by Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [value, 'Clicks']}
                    labelFormatter={(label) => {
                      const urlData = barChartData.find(item => item.name === label);
                      return urlData ? urlData.url : label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="clicks" fill="#8884d8">
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Clicks by Age */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} clicks`, 'Clicks']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* URL Stats */}
        <Card>
          <CardHeader>
            <CardTitle>URL Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total URLs</p>
                <p className="text-3xl font-bold">{urls.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-3xl font-bold">{totalClicks}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Clicks Per URL</p>
                <p className="text-3xl font-bold">
                  {urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Latest URL Created</p>
                <p className="text-xl font-bold">
                  {urls.length > 0 
                    ? format(
                        new Date(Math.max(...urls.map(url => url.createdAt.getTime()))), 
                        'MMM d, yyyy'
                      )
                    : 'No URLs yet'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
