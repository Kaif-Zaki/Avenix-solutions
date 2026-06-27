import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as HotToaster } from "react-hot-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { db } from "@/lib/db";
import { apiFetch } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;

    const syncDatabase = async () => {
      try {
        const res = await apiFetch("/api/site-data");
        if (res.ok) {
          const payload = await res.json();
          db.syncFromMongo(payload);
        }
      } catch (err) {
        console.error("Client database MongoDB synchronization failed:", err);
      }
    };
    syncDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: "#17211f",
              color: "#fff",
              border: "1px solid rgba(231,180,100,0.2)",
              fontSize: "14px",
              fontWeight: "600",
            },
          }} 
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
