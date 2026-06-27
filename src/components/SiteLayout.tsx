import { type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModernBackground from "@/components/ModernBackground";

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ModernBackground>
      <Navbar />
      <main className="min-h-screen text-stone-950">{children}</main>
      <Footer />
    </ModernBackground>
  );
};

export default SiteLayout;
