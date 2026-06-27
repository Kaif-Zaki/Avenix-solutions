import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { db } from "@/lib/db";

export default function Faq() {
  const faqs = db.getFaqs();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-b border-stone-200/50 bg-[#fbfaf7] py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* Mesh Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(35,68,61,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,68,61,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
      
      {/* Decorative ambient background glows */}
      <div className="absolute left-[-10%] top-[-10%] h-[35rem] w-[35rem] rounded-full bg-[#4e8f7a]/4 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[35rem] w-[35rem] rounded-full bg-[#e7b464]/4 blur-[130px] pointer-events-none" />

      <div className="section-container max-w-4xl relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#23443d]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#23443d]">
            <HelpCircle className="h-3.5 w-3.5" />
            Common Inquiries
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-900 sm:text-5xl tracking-tight">
            Questions companies ask before we build.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={faq.id} 
                className={`overflow-hidden rounded-xl border backdrop-blur-md shadow-sm transition-all duration-300 ${
                  isOpen 
                    ? "border-[#23443d]/30 bg-white shadow-md" 
                    : "border-stone-200/60 bg-white/60 hover:bg-white hover:border-[#23443d]/35 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold transition-colors duration-300 outline-none ${
                    isOpen ? "text-[#23443d] bg-[#23443d]/[0.02]" : "text-stone-900"
                  }`}
                >
                  <span className="tracking-tight">{faq.question}</span>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    isOpen ? "bg-[#23443d] text-white" : "bg-stone-100 text-[#9a6a2d] group-hover:bg-[#23443d]/10"
                  }`}>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="border-t border-stone-100 px-6 py-5 text-sm leading-relaxed text-stone-600">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
