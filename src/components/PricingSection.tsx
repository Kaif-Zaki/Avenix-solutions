import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";

export default function PricingSection() {
  const company = db.getCompany();
  const pricing = db.getPricing();
  return (
    <section id="pricing" className="relative border-b border-stone-200/10 bg-[#17211f] py-20 text-white sm:py-24 lg:py-28 overflow-hidden">
      {/* Dynamic dark radial background glows */}
      <div className="absolute right-[-10%] top-[-10%] h-[32rem] w-[32rem] rounded-full bg-[#e7b464]/5 blur-[120px]" />
      <div className="absolute left-[-15%] bottom-[-10%] h-[32rem] w-[32rem] rounded-full bg-[#4e8f7a]/5 blur-[120px]" />

      <div className="section-container relative z-10">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#e7b464]">Pricing</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            Clear starting points for websites and software.
          </h2>
          <p className="mt-5 text-base leading-8 text-stone-300">
            Every company is different, so these are practical starting packages. Final scope is confirmed after a short discovery call.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricing.map((tier, index) => (
            <motion.article
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`relative flex min-h-[460px] flex-col rounded-xl border p-7 transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-md ${
                tier.featured
                  ? "border-[#e7b464] bg-gradient-to-b from-[#22312e] to-[#17211f] shadow-[0_20px_50px_rgba(231,180,100,0.15)] hover:shadow-[0_20px_50px_rgba(231,180,100,0.22)]"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 hover:shadow-2xl hover:shadow-black/20"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-[#e7b464] px-4 py-1 text-xs font-bold text-stone-950 shadow-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Popular Option
                </span>
              )}
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{tier.name}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{tier.description}</p>
                <p className="mt-6 text-4xl font-extrabold text-[#e7b464] tracking-tight">{tier.price}</p>
                
                <ul className="mt-6 space-y-3.5 border-t border-white/10 pt-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-medium text-stone-100">
                      <Check className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-[#e7b464]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={company.whatsapp}
                target="_blank"
                rel="noreferrer"
                className={`mt-auto inline-flex items-center justify-center rounded-lg px-5 py-3.5 text-sm font-bold shadow-md transition-all duration-300 hover:scale-[1.02] ${
                  tier.featured
                    ? "bg-[#e7b464] text-stone-950 hover:bg-[#f1c77e] hover:shadow-lg hover:shadow-[#e7b464]/10"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/12 hover:shadow-lg"
                }`}
              >
                Discuss This Package
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
