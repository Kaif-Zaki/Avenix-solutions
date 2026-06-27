import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, PlayCircle } from "lucide-react";
import { heroHighlights, proofPoints, trustSignals } from "@/lib/siteData";
import { db } from "@/lib/db";
import ErrorBoundary from "./ErrorBoundary";
import HeroCanvas from "./HeroCanvas";

const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  const y = element.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
};

const Hero = () => {
  const company = db.getCompany();
  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] overflow-hidden border-b border-stone-900/10 bg-[#17211f] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(23,33,31,0.94),rgba(45,57,51,0.82)_48%,rgba(104,72,50,0.72))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <ErrorBoundary fallback={<div className="absolute inset-0 bg-[#17211f]" />}>
        <HeroCanvas />
      </ErrorBoundary>

      <div className="section-container relative z-10 grid min-h-[calc(100vh-80px)] items-center gap-10 pt-28 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-36 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {heroHighlights.map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold text-stone-100 backdrop-blur">
                {item}
              </span>
            ))}
          </div>

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-[#e7b464]">{company.name}</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Build the website clients trust before they ever call.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-200 sm:text-lg">
            {company.tagline} We create polished portfolio websites, custom web apps, POS systems, and automations for companies that want to look credible and operate faster.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e7b464] px-6 py-3 text-sm font-bold text-stone-950 transition hover:bg-[#f1c77e]"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo("portfolio")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/18 bg-white/8 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/14"
            >
              <PlayCircle className="h-4 w-4" />
              View Portfolio
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point.text} className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/7 px-3 py-2 text-sm text-stone-100">
                <point.icon className="h-4 w-4 text-[#e7b464]" />
                {point.text}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="rounded-lg border border-white/5 bg-white/3 backdrop-blur-sm p-3 shadow-2xl shadow-black/25">
            <div className="rounded-md border border-white/5 bg-black/8 backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#d95f59]/90" />
                <span className="h-3 w-3 rounded-full bg-[#e7b464]/90" />
                <span className="h-3 w-3 rounded-full bg-[#4e8f7a]/90" />
                <span className="ml-3 h-7 flex-1 rounded bg-white/[0.02] border border-white/5" />
              </div>
              <div className="grid gap-4 p-5 text-white sm:grid-cols-[1fr_0.72fr]">
                <div className="space-y-4">
                  <div className="h-6 w-28 rounded bg-[#e7b464]/70 backdrop-blur" />
                  <div className="space-y-2">
                    <div className="h-9 w-full rounded bg-white/5 border border-white/5" />
                    <div className="h-9 w-4/5 rounded bg-white/3 border border-white/5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-md bg-white/[0.02] border border-white/5 backdrop-blur-sm" />
                    <div className="h-24 rounded-md bg-white/[0.02] border border-white/5 backdrop-blur-sm" />
                  </div>
                  <div className="h-10 w-36 rounded bg-[#e7b464]/80 shadow-lg shadow-amber-500/5" />
                </div>
                <div className="space-y-3 rounded-md bg-white/[0.02] border border-white/5 p-4 text-white backdrop-blur-sm">
                  <div className="h-28 rounded bg-white/4 border border-white/5" />
                  <div className="grid grid-cols-2 gap-2">
                    {trustSignals.map((signal) => (
                      <div key={signal.label} className="rounded border border-white/5 bg-black/5 p-3">
                        <p className="text-xl font-bold text-[#e7b464]">{signal.value}</p>
                        <p className="mt-1 text-[11px] leading-4 text-stone-300">{signal.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => scrollTo("services")}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-300 md:flex"
      >
        Explore
        <ChevronDown className="h-4 w-4" />
      </button>
    </section>
  );
};

export default Hero;
