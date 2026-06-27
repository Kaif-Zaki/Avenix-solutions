import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { techStack } from "@/lib/siteData";
import { db, getIcon } from "@/lib/db";
import { gsap } from "gsap";

const About = () => {
  const process = db.getProcess();
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline path animation
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            end: "bottom 75%",
            scrub: true,
          },
        }
      );

      // Slide-in for the steps
      gsap.fromTo(
        ".process-step-card",
        { opacity: 0, x: 25 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="border-b border-stone-200/30 bg-[#f6f2e8] py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9a6a2d]">Process</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-950 sm:text-5xl">
              A practical software team for companies that need clarity, speed, and polish.
            </h2>
            <p className="mt-5 text-base leading-8 text-stone-700">
              Avenix Solutions helps businesses move from scattered ideas to launched digital products. We combine clean interface design, reliable development, and business-first thinking so your website or system supports sales from day one.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Business-focused planning before design starts",
                "Reusable components and maintainable code",
                "Launch support for hosting, domains, forms, and analytics",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white/70 px-4 py-3 text-sm font-semibold text-stone-800 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-[#4e8f7a]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Scrolling Timeline container */}
          <div ref={timelineRef} className="relative pl-8 md:pl-10 space-y-5">
            {/* Background Line */}
            <div className="absolute left-[23px] md:left-[27px] top-4 bottom-4 w-[2px] bg-stone-300/40 rounded-full" />
            
            {/* Growing Colored Line */}
            <div className="absolute left-[23px] md:left-[27px] top-4 bottom-4 w-[2px] rounded-full overflow-hidden">
              <div 
                ref={progressLineRef} 
                className="w-full h-full bg-[#e7b464] origin-top scale-y-0 rounded-full"
              />
            </div>

            {process.map((step, index) => (
              <article
                key={step.id}
                className="process-step-card relative grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#23443d]/20 sm:grid-cols-[auto_1fr]"
              >
                {/* Dot marker */}
                <div className="absolute left-[-21px] md:left-[-25px] top-[26px] h-3.5 w-3.5 rounded-full bg-[#f6f2e8] border-[3px] border-[#23443d] z-10 shadow-sm" />

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#23443d] text-white shadow-md shadow-[#23443d]/10">
                  {(() => {
                    const IconComponent = getIcon(step.iconName);
                    return <IconComponent className="h-5 w-5" />;
                  })()}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a6a2d]">Step {index + 1}</p>
                  <h3 className="mt-1 text-xl font-bold text-stone-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-700">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-lg border border-stone-200/10 bg-[#17211f] p-6 text-white sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute right-[-10%] top-[-20%] h-[20rem] w-[20rem] rounded-full bg-[#e7b464]/5 blur-[80px]" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#e7b464]">Tech stack</p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">Modern tools, chosen for dependable delivery.</h3>
            </div>
            <p className="max-w-xl text-sm leading-7 text-stone-300">
              We use proven frontend, backend, database, cloud, and analytics tools so your project is easy to maintain after launch.
            </p>
          </div>
          <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/7 px-4 py-3 transition hover:bg-white/10 hover:border-white/20">
                <tech.icon className="h-4 w-4 text-[#e7b464]" />
                <span className="text-sm font-semibold text-stone-100">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
