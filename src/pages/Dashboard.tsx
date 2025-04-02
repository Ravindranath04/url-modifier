
import React from "react";
import UrlForm from "@/components/UrlForm";
import UrlList from "@/components/UrlList";
import { useUrlShortener } from "@/context/UrlShortenerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, Link, Rocket } from "lucide-react";

const Dashboard: React.FC = () => {
  const { urls } = useUrlShortener();
  
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const totalUrls = urls.length;
  const mostClicked = urls.length > 0 
    ? urls.reduce((prev, current) => (prev.clicks > current.clicks) ? prev : current) 
    : null;

  // Count URLs by category
  const categoryCounts = urls.reduce((acc, url) => {
    const category = url.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get the most common category
  const mostCommonCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">URL Shortener</h1>
        <p className="text-muted-foreground">
          Shorten your URLs and track their performance
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Rocket className="h-10 w-10" />
            <div>
              <h2 className="text-xl font-bold">AI-Powered URL Categorization</h2>
              <p className="opacity-90">
                Our system automatically analyzes and categorizes your URLs to help you organize and understand your links better.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUrls}</div>
            <p className="text-xs text-muted-foreground">
              URLs shortened
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Link redirects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common Category</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {mostCommonCategory !== "None" ? (
              <>
                <div className="text-2xl font-bold">{mostCommonCategory}</div>
                <p className="text-xs text-muted-foreground">
                  {categoryCounts[mostCommonCategory]} URLs in this category
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <UrlForm />
      <UrlList />
    </div>
  );
};

export default Dashboard;
