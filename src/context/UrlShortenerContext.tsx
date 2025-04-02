
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { urlSecurityService, SecurityCheckResult } from "@/services/urlSecurityService";

export type UrlCategory = 
  | "News" 
  | "Social Media" 
  | "Shopping" 
  | "Tech" 
  | "Entertainment" 
  | "Education" 
  | "Business" 
  | "Travel" 
  | "Health" 
  | "Government" 
  | "Finance" 
  | "Sports" 
  | "Other";

export type UrlLocation = 
  | "North America" 
  | "Europe" 
  | "Asia" 
  | "South America" 
  | "Africa" 
  | "Australia" 
  | "Global" 
  | "Unknown";

interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  lastClickedAt?: Date;
  category?: UrlCategory;
  location?: UrlLocation;
  securityStatus?: {
    safe: boolean;
    checkedAt: Date;
    results: SecurityCheckResult[];
  };
}

interface UrlContextType {
  urls: UrlData[];
  addUrl: (originalUrl: string) => Promise<string | null>;
  getOriginalUrl: (shortCode: string) => string | null;
  recordClick: (shortCode: string) => void;
  deleteUrl: (id: string) => void;
  categorizeUrl: (id: string, category: UrlCategory, location?: UrlLocation) => void;
  checkUrlSafety: (url: string) => Promise<SecurityCheckResult[]>;
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
  // Generate a random 6-character alphanumeric code that doesn't include "lovableproject"
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Dataset for domain categorization (simulating Kaggle dataset)
const categoryData = {
  // News sites
  'news': 'News', 'cnn.com': 'News', 'nytimes.com': 'News', 'bbc.com': 'News', 'reuters.com': 'News',
  'washingtonpost.com': 'News', 'theguardian.com': 'News', 'wsj.com': 'News', 'bloomberg.com': 'News',
  
  // Social Media
  'facebook.com': 'Social Media', 'twitter.com': 'Social Media', 'instagram.com': 'Social Media',
  'linkedin.com': 'Social Media', 'pinterest.com': 'Social Media', 'reddit.com': 'Social Media',
  'tumblr.com': 'Social Media', 'tiktok.com': 'Social Media', 'snapchat.com': 'Social Media',
  
  // Shopping
  'amazon.com': 'Shopping', 'ebay.com': 'Shopping', 'walmart.com': 'Shopping', 'etsy.com': 'Shopping',
  'shopify.com': 'Shopping', 'bestbuy.com': 'Shopping', 'target.com': 'Shopping', 'shop': 'Shopping',
  
  // Tech
  'github.com': 'Tech', 'stackoverflow.com': 'Tech', 'microsoft.com': 'Tech', 'apple.com': 'Tech',
  'google.com': 'Tech', 'dev.to': 'Tech', 'techcrunch.com': 'Tech', 'wired.com': 'Tech', 
  
  // Entertainment
  'youtube.com': 'Entertainment', 'netflix.com': 'Entertainment', 'hulu.com': 'Entertainment',
  'spotify.com': 'Entertainment', 'twitch.tv': 'Entertainment', 'imdb.com': 'Entertainment',
  
  // Education
  'edu': 'Education', 'coursera.org': 'Education', 'udemy.com': 'Education', 'edx.org': 'Education',
  'khanacademy.org': 'Education', 'mit.edu': 'Education', 'harvard.edu': 'Education', 
  'stanford.edu': 'Education', 'school': 'Education', 'university': 'Education', 'college': 'Education',
  
  // Business
  'business': 'Business', 'corp': 'Business', 'inc': 'Business', 'company': 'Business',
  'enterprise': 'Business', 'salesforce.com': 'Business', 'oracle.com': 'Business',
  'sap.com': 'Business', 'hubspot.com': 'Business',
  
  // Travel
  'travel': 'Travel', 'booking.com': 'Travel', 'expedia.com': 'Travel', 'airbnb.com': 'Travel',
  'tripadvisor.com': 'Travel', 'hotels.com': 'Travel', 'kayak.com': 'Travel',
  
  // Health
  'health': 'Health', 'webmd.com': 'Health', 'mayoclinic.org': 'Health', 'nih.gov': 'Health',
  'who.int': 'Health', 'hospital': 'Health', 'medical': 'Health', 'healthcare': 'Health',
  
  // Government
  'gov': 'Government', 'whitehouse.gov': 'Government', 'usa.gov': 'Government',
  'un.org': 'Government', 'europa.eu': 'Government',
  
  // Finance
  'finance': 'Finance', 'bank': 'Finance', 'invest': 'Finance', 'trading': 'Finance',
  'nasdaq.com': 'Finance', 'nyse.com': 'Finance', 'coinbase.com': 'Finance',
  'paypal.com': 'Finance', 'visa.com': 'Finance', 'mastercard.com': 'Finance',
  
  // Sports
  'sports': 'Sports', 'espn.com': 'Sports', 'nba.com': 'Sports', 'nfl.com': 'Sports',
  'mlb.com': 'Sports', 'fifa.com': 'Sports', 'olympic.org': 'Sports'
};

// Dataset for location mapping based on TLDs and common domains
const locationData = {
  // North America
  'us': 'North America', 'ca': 'North America', 'mx': 'North America', 
  'usa': 'North America', 'canada': 'North America', 'mexico': 'North America',
  
  // Europe
  'uk': 'Europe', 'fr': 'Europe', 'de': 'Europe', 'it': 'Europe', 'es': 'Europe',
  'nl': 'Europe', 'ch': 'Europe', 'se': 'Europe', 'no': 'Europe', 'fi': 'Europe',
  'ru': 'Europe', 'pl': 'Europe', 'eu': 'Europe',
  
  // Asia
  'cn': 'Asia', 'jp': 'Asia', 'kr': 'Asia', 'in': 'Asia', 'sg': 'Asia',
  'hk': 'Asia', 'tw': 'Asia', 'th': 'Asia', 'vn': 'Asia', 'my': 'Asia',
  
  // South America
  'br': 'South America', 'ar': 'South America', 'cl': 'South America', 'co': 'South America',
  'pe': 'South America', 've': 'South America',
  
  // Africa
  'za': 'Africa', 'ng': 'Africa', 'eg': 'Africa', 'ke': 'Africa', 'ma': 'Africa',
  
  // Australia/Oceania
  'au': 'Australia', 'nz': 'Australia'
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
          lastClickedAt: url.lastClickedAt ? new Date(url.lastClickedAt) : undefined,
          securityStatus: url.securityStatus ? {
            ...url.securityStatus,
            checkedAt: new Date(url.securityStatus.checkedAt)
          } : undefined
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

  const checkUrlSafety = async (url: string): Promise<SecurityCheckResult[]> => {
    return await urlSecurityService.checkUrlSafety(url);
  };

  const addUrl = async (originalUrl: string): Promise<string | null> => {
    // Validate URL
    try {
      new URL(originalUrl);
    } catch (e) {
      toast.error("Please enter a valid URL");
      return null;
    }

    // Check if URL already exists
    const existingUrl = urls.find(url => url.originalUrl === originalUrl);
    if (existingUrl) {
      toast.info("This URL has already been shortened");
      return existingUrl.shortCode;
    }

    // Check URL safety
    const securityResults = await checkUrlSafety(originalUrl);
    const isSafe = urlSecurityService.isUrlSafe(securityResults);
    
    if (!isSafe) {
      const threats = urlSecurityService.getAllThreats(securityResults).filter(Boolean);
      toast.error(`This URL may be unsafe: ${threats.join(", ")}`, {
        duration: 5000,
      });
      return null;
    }

    const shortCode = generateShortCode();
    
    // Analyze URL for categorization and location detection
    const { category, location } = analyzeUrlMetadata(originalUrl);
    
    const newUrl: UrlData = {
      id: uuidv4(),
      originalUrl,
      shortCode,
      createdAt: new Date(),
      clicks: 0,
      category,
      location,
      securityStatus: {
        safe: isSafe,
        checkedAt: new Date(),
        results: securityResults
      }
    };

    setUrls(prevUrls => [...prevUrls, newUrl]);
    
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

  const categorizeUrl = (id: string, category: UrlCategory, location?: UrlLocation) => {
    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.id === id 
          ? { ...url, category, location: location || url.location } 
          : url
      )
    );
  };

  const analyzeUrlMetadata = (url: string): { category: UrlCategory, location: UrlLocation } => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const domainParts = hostname.split('.');
      const tld = domainParts[domainParts.length - 1]; // e.g., com, org, edu
      const domain = domainParts[domainParts.length - 2]; // e.g., google, facebook
      const fullDomain = domain + '.' + tld;
      
      // Category detection - search through all parts of the URL
      let category: UrlCategory = "Other";
      let foundCategory = false;
      
      // Check full domain first (e.g., "github.com")
      if (categoryData[fullDomain]) {
        category = categoryData[fullDomain] as UrlCategory;
        foundCategory = true;
      }
      
      // Check individual parts if no exact match
      if (!foundCategory) {
        for (const part of [...domainParts, ...urlObj.pathname.split('/')]) {
          if (part && categoryData[part.toLowerCase()]) {
            category = categoryData[part.toLowerCase()] as UrlCategory;
            foundCategory = true;
            break;
          }
        }
      }
      
      // Check keyword matches in full domain + path if still no match
      if (!foundCategory) {
        const fullUrl = hostname + urlObj.pathname.toLowerCase();
        for (const [keyword, cat] of Object.entries(categoryData)) {
          if (fullUrl.includes(keyword)) {
            category = cat as UrlCategory;
            foundCategory = true;
            break;
          }
        }
      }
      
      // Location detection - primarily from TLD, domain name, or path components
      let location: UrlLocation = "Unknown";
      let foundLocation = false;
      
      // Check TLD for country code
      if (locationData[tld]) {
        location = locationData[tld] as UrlLocation;
        foundLocation = true;
      }
      
      // Check parts of domain and path for location hints if no TLD match
      if (!foundLocation) {
        for (const part of [...domainParts, ...urlObj.pathname.split('/')]) {
          if (part && locationData[part.toLowerCase()]) {
            location = locationData[part.toLowerCase()] as UrlLocation;
            foundLocation = true;
            break;
          }
        }
      }
      
      // If domain is a global company or service, mark it as global
      const globalDomains = [
        'google', 'facebook', 'twitter', 'amazon', 'microsoft', 'apple', 
        'netflix', 'youtube', 'github', 'wikipedia', 'linkedin', 'instagram'
      ];
      
      if (!foundLocation && globalDomains.includes(domain)) {
        location = "Global";
      }
      
      console.log(`Categorized ${url} as ${category} in ${location}`);
      
      return { category, location };
      
    } catch (error) {
      console.error("Error analyzing URL metadata:", error);
      return { category: "Other", location: "Unknown" };
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
        categorizeUrl,
        checkUrlSafety
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};
