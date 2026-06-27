import { type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModernBackground from "@/components/ModernBackground";
import Chatbot from "@/components/Chatbot";

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ModernBackground>
      <Navbar />
      <main className="min-h-screen text-stone-950">{children}</main>
      <Footer />
      <Chatbot />
    </ModernBackground>
  );
};

export default SiteLayout;
