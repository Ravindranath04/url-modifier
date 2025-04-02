
import React from "react";
import UrlForm from "@/components/UrlForm";
import UrlList from "@/components/UrlList";
import { useUrlShortener } from "@/context/UrlShortenerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, Link } from "lucide-react";

const Dashboard: React.FC = () => {
  const { urls } = useUrlShortener();
  
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const totalUrls = urls.length;
  const mostClicked = urls.length > 0 
    ? urls.reduce((prev, current) => (prev.clicks > current.clicks) ? prev : current) 
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">URL Shortener</h1>
        <p className="text-muted-foreground">
          Shorten your URLs and track their performance
        </p>
      </div>

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
            <CardTitle className="text-sm font-medium">Most Popular URL</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {mostClicked ? (
              <>
                <div className="text-2xl font-bold">{mostClicked.clicks} clicks</div>
                <p className="text-xs text-muted-foreground truncate">
                  {mostClicked.originalUrl}
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
