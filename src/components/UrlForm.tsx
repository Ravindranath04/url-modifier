
import React, { useState } from "react";
import { useUrlShortener } from "@/context/UrlShortenerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Link } from "lucide-react";

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { addUrl } = useUrlShortener();

  const handleSubmit = (e: React.FormEvent) => {
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

    const shortCode = addUrl(urlToShorten);
    if (shortCode) {
      setGeneratedCode(shortCode);
    }
  };

  const copyToClipboard = () => {
    const shortUrl = `${window.location.origin}/s/${generatedCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

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
              <Button type="submit">Shorten URL</Button>
            </div>
          </div>

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
