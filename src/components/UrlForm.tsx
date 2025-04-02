
import React, { useState } from "react";
import { useUrlShortener } from "@/context/UrlShortenerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Link, ShieldCheck, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SecurityCheckResult } from "@/services/urlSecurityService";

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [securityResults, setSecurityResults] = useState<SecurityCheckResult[] | null>(null);
  const { addUrl, checkUrlSafety } = useUrlShortener();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Prepend http:// if no protocol is specified
    let urlToShorten = url;
    if (!/^https?:\/\//i.test(url)) {
      urlToShorten = `https://${url}`;
    }

    setIsChecking(true);
    setSecurityResults(null);
    
    try {
      // Check URL safety first
      const results = await checkUrlSafety(urlToShorten);
      setSecurityResults(results);
      
      // Add URL if it's safe (the addUrl function will handle unsafe URLs)
      const shortCode = await addUrl(urlToShorten);
      if (shortCode) {
        setGeneratedCode(shortCode);
      }
    } catch (error) {
      console.error("Error processing URL:", error);
      toast.error("Failed to process the URL");
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = () => {
    const shortUrl = `${window.location.origin}/s/${generatedCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  // Check if any security threats were found
  const hasSecurity = securityResults !== null;
  const isUrlSafe = hasSecurity && securityResults.every(result => result.safe);
  const securityThreats = hasSecurity 
    ? securityResults.flatMap(result => result.threats).filter(Boolean)
    : [];

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Enter a long URL to shorten
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking security...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Shorten & Check Security
                  </>
                )}
              </Button>
            </div>
          </div>

          {hasSecurity && !isUrlSafe && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Security Warning
              </AlertTitle>
              <AlertDescription>
                <p>This URL may be unsafe. The following issues were detected:</p>
                <ul className="list-disc list-inside mt-2">
                  {securityThreats.map((threat, index) => (
                    <li key={index}>{threat}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {generatedCode && (
            <div className="mt-4 p-4 bg-primary-50 rounded-md">
              <p className="text-sm font-medium mb-2">Your shortened URL:</p>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <a
                  href={`/s/${generatedCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {window.location.origin}/s/{generatedCode}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-2"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlForm;
