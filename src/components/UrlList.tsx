
import React from "react";
import { useUrlShortener } from "@/context/UrlShortenerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Trash, Calendar, BarChart, CopyCheck, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import CategoryBadge from "./CategoryBadge";
import SecurityBadge from "./SecurityBadge";

const UrlList: React.FC = () => {
  const { urls, deleteUrl } = useUrlShortener();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (shortCode: string, id: string) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (urls.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-4">
            <p className="text-muted-foreground">No URLs have been shortened yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Shortened URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original URL</TableHead>
                <TableHead>Short URL</TableHead>
                <TableHead>Category</TableHead>
                <TableHead><ShieldCheck size={16} className="mr-1 inline" /> Security</TableHead>
                <TableHead><Calendar size={16} className="mr-1 inline" /> Created</TableHead>
                <TableHead><BarChart size={16} className="mr-1 inline" /> Clicks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell className="max-w-[200px] truncate">
                    <a 
                      href={url.originalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {url.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={`/s/${url.shortCode}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {`${window.location.host}/s/${url.shortCode}`}
                    </a>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={url.category || "Other"} />
                  </TableCell>
                  <TableCell>
                    <SecurityBadge securityStatus={url.securityStatus} />
                  </TableCell>
                  <TableCell>
                    {format(url.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {url.clicks}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(url.shortCode, url.id)}
                    >
                      {copiedId === url.id ? <CopyCheck size={16} /> : <Copy size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUrl(url.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlList;
