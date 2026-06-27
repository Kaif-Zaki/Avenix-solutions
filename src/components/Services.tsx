import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
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
    <section id="services" ref={sectionRef} className="relative overflow-hidden border-b border-stone-200/30 bg-[#f6f2e8] py-20 sm:py-24 lg:py-28">
      {/* Decorative background glows */}
      <div className="absolute left-[-10%] top-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#4e8f7a]/5 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#e7b464]/5 blur-[120px]" />

      <div className="section-container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div ref={headerRef} className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9a6a2d]">Services</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-950 sm:text-5xl">
              Everything a company needs to sell online and run smoother.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-stone-700">
              We build websites that make your company look established, then connect the systems behind them so leads, orders, and operations stay organized.
            </p>
          </div>

          <div className="services-grid grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="service-card group rounded-lg border border-stone-200/80 bg-white/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#23443d]/30 hover:bg-white hover:shadow-xl"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#23443d] text-white shadow-md shadow-[#23443d]/10">
                    {(() => {
                      const IconComponent = getIcon(service.iconName);
                      return <IconComponent className="h-5 w-5" />;
                    })()}
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-stone-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#9a6a2d]" />
                </div>
                <h3 className="text-xl font-bold text-stone-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-700">{service.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.outcomes.map((outcome) => (
                    <span key={outcome} className="rounded-full border border-stone-200/60 bg-[#fbfaf6] px-3 py-1 text-xs font-bold text-stone-600">
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
