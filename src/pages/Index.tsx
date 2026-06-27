import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import SiteLayout from "@/components/SiteLayout";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import PricingSection from "@/components/PricingSection";
import { db } from "@/lib/db";

const Index = () => {
  const location = useLocation();
  const [, setSyncTime] = useState(Date.now());

  useEffect(() => {
    return db.subscribe(() => {
      setSyncTime(Date.now());
    });
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // Small timeout to allow R3F canvas and dynamic LocalStorage items to mount
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -80; // Navbar offset height
          const y =
            element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <SiteLayout>
      <Hero />
      <Services />
      <Portfolio />
      <PricingSection />
      <About />
      <Faq />
      <Contact />
    </SiteLayout>
  );
};

export default Index;
