
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { UrlShortenerProvider } from "@/context/UrlShortenerContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Redirect from "@/pages/Redirect";
import NotFound from "@/pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <UrlShortenerProvider>
          <TooltipProvider delayDuration={0}>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/s/:shortCode" element={<Redirect />} />
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </TooltipProvider>
        </UrlShortenerProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
