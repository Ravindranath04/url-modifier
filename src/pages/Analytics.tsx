
import React from "react";
import { useUrlShortener, UrlCategory, UrlLocation } from "@/context/UrlShortenerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import CategoryBadge from "@/components/CategoryBadge";
import LocationBadge from "@/components/LocationBadge";

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FF8A80', '#B388FF', '#8BC34A', '#FF4081', '#FBC02D'];

const Analytics: React.FC = () => {
  const { urls } = useUrlShortener();

  // Prepare data for category distribution
  const categoryData = React.useMemo(() => {
    const categories: Record<UrlCategory, number> = {
      "News": 0,
      "Social Media": 0,
      "Shopping": 0,
      "Tech": 0,
      "Entertainment": 0,
      "Education": 0,
      "Business": 0,
      "Travel": 0,
      "Health": 0,
      "Government": 0,
      "Finance": 0,
      "Sports": 0,
      "Other": 0
    };

    urls.forEach(url => {
      const category = url.category || "Other";
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [urls]);

  // Prepare data for clicks by category
  const clicksData = React.useMemo(() => {
    const categoryClicks: Record<UrlCategory, number> = {
      "News": 0,
      "Social Media": 0,
      "Shopping": 0,
      "Tech": 0,
      "Entertainment": 0,
      "Education": 0,
      "Business": 0,
      "Travel": 0,
      "Health": 0,
      "Government": 0,
      "Finance": 0,
      "Sports": 0,
      "Other": 0
    };

    urls.forEach(url => {
      const category = url.category || "Other";
      categoryClicks[category] = (categoryClicks[category] || 0) + url.clicks;
    });

    return Object.entries(categoryClicks)
      .filter(([_, count]) => count > 0)
      .map(([name, clicks]) => ({ name, clicks }));
  }, [urls]);

  // Prepare data for location distribution
  const locationData = React.useMemo(() => {
    const locations: Record<UrlLocation, number> = {
      "North America": 0,
      "Europe": 0,
      "Asia": 0,
      "South America": 0,
      "Africa": 0,
      "Australia": 0,
      "Global": 0,
      "Unknown": 0
    };

    urls.forEach(url => {
      const location = url.location || "Unknown";
      locations[location] = (locations[location] || 0) + 1;
    });

    return Object.entries(locations)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [urls]);

  // Prepare data for clicks by location
  const locationClicksData = React.useMemo(() => {
    const locationClicks: Record<UrlLocation, number> = {
      "North America": 0,
      "Europe": 0,
      "Asia": 0,
      "South America": 0,
      "Africa": 0,
      "Australia": 0,
      "Global": 0,
      "Unknown": 0
    };

    urls.forEach(url => {
      const location = url.location || "Unknown";
      locationClicks[location] = (locationClicks[location] || 0) + url.clicks;
    });

    return Object.entries(locationClicks)
      .filter(([_, count]) => count > 0)
      .map(([name, clicks]) => ({ name, clicks }));
  }, [urls]);

  // Organize URLs by category and location
  const urlsByCategory = React.useMemo(() => {
    const categorized: Record<UrlCategory, typeof urls> = {
      "News": [],
      "Social Media": [],
      "Shopping": [],
      "Tech": [],
      "Entertainment": [],
      "Education": [],
      "Business": [],
      "Travel": [],
      "Health": [],
      "Government": [],
      "Finance": [],
      "Sports": [],
      "Other": []
    };

    urls.forEach(url => {
      const category = url.category || "Other";
      if (!categorized[category]) categorized[category] = [];
      categorized[category].push(url);
    });

    return categorized;
  }, [urls]);

  const urlsByLocation = React.useMemo(() => {
    const locationMap: Record<UrlLocation, typeof urls> = {
      "North America": [],
      "Europe": [],
      "Asia": [],
      "South America": [],
      "Africa": [],
      "Australia": [],
      "Global": [],
      "Unknown": []
    };

    urls.forEach(url => {
      const location = url.location || "Unknown";
      if (!locationMap[location]) locationMap[location] = [];
      locationMap[location].push(url);
    });

    return locationMap;
  }, [urls]);

  if (urls.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View insights about your shortened URLs
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-10">
              <p className="text-muted-foreground">No data available. Create some shortened URLs first.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View insights about your shortened URLs
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>URL Categories Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name }) => name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clicks by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clicksData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clicks" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>URLs by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {Object.entries(urlsByCategory).map(([category, urls]) => 
                    urls.length > 0 ? (
                      <TabsTrigger value={category} key={category}>
                        {category} ({urls.length})
                      </TabsTrigger>
                    ) : null
                  )}
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {urls.map(url => (
                      <Card key={url.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <CategoryBadge category={url.category || "Other"} />
                            <LocationBadge location={url.location || "Unknown"} />
                          </div>
                          <div className="flex justify-end items-start mb-2">
                            <div className="text-sm text-muted-foreground">{url.clicks} clicks</div>
                          </div>
                          <div className="truncate mb-2">
                            <a 
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              {url.originalUrl}
                            </a>
                          </div>
                          <div className="text-sm font-medium">
                            {`${window.location.host}/s/${url.shortCode}`}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {Object.entries(urlsByCategory).map(([category, categoryUrls]) => (
                  <TabsContent value={category} key={category}>
                    {categoryUrls.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categoryUrls.map(url => (
                          <Card key={url.id}>
                            <CardContent className="pt-6">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <CategoryBadge category={url.category || "Other"} />
                                <LocationBadge location={url.location || "Unknown"} />
                              </div>
                              <div className="flex justify-end items-start mb-2">
                                <div className="text-sm text-muted-foreground">{url.clicks} clicks</div>
                              </div>
                              <div className="truncate mb-2">
                                <a 
                                  href={url.originalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  {url.originalUrl}
                                </a>
                              </div>
                              <div className="text-sm font-medium">
                                {`${window.location.host}/s/${url.shortCode}`}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground p-4">No URLs in this category</p>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>URL Locations Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name }) => name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clicks by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={locationClicksData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clicks" fill="#36A2EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>URLs by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {Object.entries(urlsByLocation).map(([location, urls]) => 
                    urls.length > 0 ? (
                      <TabsTrigger value={location} key={location}>
                        {location} ({urls.length})
                      </TabsTrigger>
                    ) : null
                  )}
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {urls.map(url => (
                      <Card key={url.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <LocationBadge location={url.location || "Unknown"} />
                            <CategoryBadge category={url.category || "Other"} />
                          </div>
                          <div className="flex justify-end items-start mb-2">
                            <div className="text-sm text-muted-foreground">{url.clicks} clicks</div>
                          </div>
                          <div className="truncate mb-2">
                            <a 
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              {url.originalUrl}
                            </a>
                          </div>
                          <div className="text-sm font-medium">
                            {`${window.location.host}/s/${url.shortCode}`}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {Object.entries(urlsByLocation).map(([location, locationUrls]) => (
                  <TabsContent value={location} key={location}>
                    {locationUrls.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {locationUrls.map(url => (
                          <Card key={url.id}>
                            <CardContent className="pt-6">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <LocationBadge location={url.location || "Unknown"} />
                                <CategoryBadge category={url.category || "Other"} />
                              </div>
                              <div className="flex justify-end items-start mb-2">
                                <div className="text-sm text-muted-foreground">{url.clicks} clicks</div>
                              </div>
                              <div className="truncate mb-2">
                                <a 
                                  href={url.originalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  {url.originalUrl}
                                </a>
                              </div>
                              <div className="text-sm font-medium">
                                {`${window.location.host}/s/${url.shortCode}`}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground p-4">No URLs in this location</p>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
