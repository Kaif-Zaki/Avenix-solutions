import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { db } from "@/lib/db";

export default function Faq() {
  const faqs = db.getFaqs();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-stone-900/10 bg-[#e8f0ee] py-20 sm:py-24 lg:py-28">
      <div className="section-container max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9a6a2d]">FAQ</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-950 sm:text-5xl">
            Questions companies ask before we build.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id} className="overflow-hidden rounded-lg border border-stone-900/10 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-bold text-stone-950"
                >
                  {faq.question}
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#9a6a2d] transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="border-t border-stone-900/10 px-5 py-5 text-sm leading-7 text-stone-700">
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
