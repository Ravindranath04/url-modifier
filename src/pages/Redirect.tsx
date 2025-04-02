
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUrlShortener } from "@/context/UrlShortenerContext";

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { getOriginalUrl, recordClick } = useUrlShortener();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortCode) {
      navigate("/", { replace: true });
      return;
    }

    const originalUrl = getOriginalUrl(shortCode);
    
    if (originalUrl) {
      // Record the click
      recordClick(shortCode);
      
      // Redirect to the original URL
      window.location.href = originalUrl;
    } else {
      // Redirect to a not found page if the short URL doesn't exist
      navigate("/not-found", { replace: true });
    }
  }, [shortCode, getOriginalUrl, recordClick, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you to your destination.</p>
      </div>
    </div>
  );
};

export default Redirect;
