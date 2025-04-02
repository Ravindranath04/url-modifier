
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export type UrlCategory = "News" | "Social Media" | "Shopping" | "Tech" | "Entertainment" | "Education" | "Other";

interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  lastClickedAt?: Date;
  category?: UrlCategory;
}

interface UrlContextType {
  urls: UrlData[];
  addUrl: (originalUrl: string) => string;
  getOriginalUrl: (shortCode: string) => string | null;
  recordClick: (shortCode: string) => void;
  deleteUrl: (id: string) => void;
  categorizeUrl: (id: string, category: UrlCategory) => void;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const useUrlShortener = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error("useUrlShortener must be used within a UrlShortenerProvider");
  }
  return context;
};

const generateShortCode = () => {
  // Generate a random 6-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const UrlShortenerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urls, setUrls] = useState<UrlData[]>(() => {
    const savedUrls = localStorage.getItem("shortenedUrls");
    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls);
        return parsedUrls.map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          lastClickedAt: url.lastClickedAt ? new Date(url.lastClickedAt) : undefined
        }));
      } catch (error) {
        console.error("Error parsing URLs from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("shortenedUrls", JSON.stringify(urls));
  }, [urls]);

  const addUrl = (originalUrl: string): string => {
    // Validate URL
    try {
      new URL(originalUrl);
    } catch (e) {
      toast.error("Please enter a valid URL");
      return "";
    }

    // Check if URL already exists
    const existingUrl = urls.find(url => url.originalUrl === originalUrl);
    if (existingUrl) {
      toast.info("This URL has already been shortened");
      return existingUrl.shortCode;
    }

    const shortCode = generateShortCode();
    const newUrl: UrlData = {
      id: uuidv4(),
      originalUrl,
      shortCode,
      createdAt: new Date(),
      clicks: 0,
      category: "Other" // Default category
    };

    setUrls(prevUrls => [...prevUrls, newUrl]);
    
    // Attempt to categorize the URL
    analyzeUrl(newUrl.id, originalUrl);
    
    toast.success("URL shortened successfully");
    return shortCode;
  };

  const getOriginalUrl = (shortCode: string): string | null => {
    const url = urls.find(url => url.shortCode === shortCode);
    return url ? url.originalUrl : null;
  };

  const recordClick = (shortCode: string) => {
    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.shortCode === shortCode 
          ? { ...url, clicks: url.clicks + 1, lastClickedAt: new Date() } 
          : url
      )
    );
  };

  const deleteUrl = (id: string) => {
    setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
    toast.success("URL deleted successfully");
  };

  const categorizeUrl = (id: string, category: UrlCategory) => {
    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.id === id 
          ? { ...url, category } 
          : url
      )
    );
  };

  const analyzeUrl = async (id: string, url: string) => {
    try {
      const hostname = new URL(url).hostname;
      
      // Simple pattern-based classification
      let category: UrlCategory = "Other";
      
      if (hostname.includes("news") || hostname.includes("nytimes") || hostname.includes("cnn") || hostname.includes("bbc")) {
        category = "News";
      } else if (hostname.includes("facebook") || hostname.includes("twitter") || hostname.includes("instagram") || hostname.includes("linkedin")) {
        category = "Social Media";
      } else if (hostname.includes("amazon") || hostname.includes("ebay") || hostname.includes("walmart") || hostname.includes("etsy") || hostname.includes("shop")) {
        category = "Shopping";
      } else if (hostname.includes("github") || hostname.includes("stackoverflow") || hostname.includes("dev") || hostname.includes("tech")) {
        category = "Tech";
      } else if (hostname.includes("youtube") || hostname.includes("netflix") || hostname.includes("hulu") || hostname.includes("spotify")) {
        category = "Entertainment";
      } else if (hostname.includes("edu") || hostname.includes("course") || hostname.includes("learn") || hostname.includes("academy")) {
        category = "Education";
      }
      
      categorizeUrl(id, category);
      
      // Note: In a production app, we would call an actual AI service here
      // For demo purposes, we're using a simple pattern matching approach
      console.log(`Categorized ${url} as ${category}`);
      
    } catch (error) {
      console.error("Error analyzing URL:", error);
    }
  };

  return (
    <UrlContext.Provider 
      value={{ 
        urls, 
        addUrl, 
        getOriginalUrl, 
        recordClick, 
        deleteUrl,
        categorizeUrl
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};
