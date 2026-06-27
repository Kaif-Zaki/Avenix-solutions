import { useEffect, useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { db, getIcon } from "@/lib/db";
import { gsap } from "gsap";

const Services = () => {
  const services = db.getServices();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Slide Up
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      // Cards staggered entry
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 82%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden border-b border-stone-200/50 bg-[#fbfaf7] py-20 sm:py-24 lg:py-28">
      {/* Mesh Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(35,68,61,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,68,61,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
      
      {/* Decorative ambient background glows */}
      <div className="absolute left-[-10%] top-[-10%] h-[35rem] w-[35rem] rounded-full bg-[#4e8f7a]/4 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[35rem] w-[35rem] rounded-full bg-[#e7b464]/4 blur-[130px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left Column Sticky Header */}
          <div ref={headerRef} className="lg:sticky lg:top-28 lg:h-fit">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#23443d]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#23443d]">
              <Sparkles className="h-3.5 w-3.5" />
              Our Expertise
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-900 sm:text-5xl tracking-tight">
              Everything a company needs to sell online and run smoother.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600">
              We build websites that make your company look established, then connect the systems behind them so leads, orders, and operations stay organized.
            </p>
          </div>

          {/* Right Column Services Grid */}
          <div className="services-grid grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="service-card group relative rounded-xl border border-stone-200/70 bg-white/50 p-6 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#23443d]/30 hover:bg-white hover:shadow-xl"
              >
                {/* Accent line on hover */}
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-xl bg-[#23443d] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="mb-5 flex items-start justify-between gap-4">
                  {/* Styled animated icon container */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#23443d] text-white shadow-md shadow-[#23443d]/15 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {(() => {
                      const IconComponent = getIcon(service.iconName);
                      return <IconComponent className="h-5.5 w-5.5 text-[#e7b464]" />;
                    })()}
                  </div>
                  
                  {/* Subtle external action signifier */}
                  <div className="rounded-full bg-stone-100/80 p-1.5 group-hover:bg-[#23443d]/10 transition-colors duration-300">
                    <ArrowUpRight className="h-4 w-4 text-stone-450 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#9a6a2d]" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#23443d] transition-colors duration-300 tracking-tight">
                  {service.title}
                </h3>
                
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {service.description}
                </p>
                
                {/* Modern detailed outcome badges */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {service.outcomes.map((outcome) => (
                    <span 
                      key={outcome} 
                      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/50 bg-stone-50/50 px-2.5 py-1 text-xs font-semibold text-stone-600 transition-all duration-300 group-hover:border-[#23443d]/20 group-hover:bg-[#23443d]/5 group-hover:text-[#23443d]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#23443d]/60 group-hover:bg-[#23443d] transition-colors duration-300" />
                      {outcome}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
