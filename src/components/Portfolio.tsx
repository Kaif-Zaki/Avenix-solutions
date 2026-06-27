import { ArrowRight, ExternalLink, Globe, Lock } from "lucide-react";
import { db, getIcon } from "@/lib/db";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { mediaUrl } from "@/lib/api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Portfolio = () => {
  const projects = db.getProjects();

  return (
    <section id="portfolio" className="relative border-b border-stone-200/50 bg-stone-50/60 py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(35,68,61,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,68,61,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="section-container">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#23443d]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#23443d]">
              <Globe className="h-3 w-3" />
              Portfolio Showcase
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-900 sm:text-5xl tracking-tight">
              Website and software builds shaped for serious growth.
            </h2>
          </div>
          <a
            href="#contact"
            className="group inline-flex w-fit items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-950 shadow-sm transition-all duration-300 hover:bg-[#23443d] hover:text-white hover:border-[#23443d] hover:shadow-md"
          >
            Request a similar build
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="portfolio-slider relative mt-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={28}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16 !px-1"
          >
            {projects.map((project) => {
              const isWebsite = project.category?.toLowerCase().includes("website");
              const hasLink = Boolean(project.liveUrl);

              return (
                <SwiperSlide key={project.id} className="h-auto">
                  <article className="group overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:border-[#23443d]/30 hover:shadow-xl">
                    
                    {/* Media / Browser Frame Preview */}
                    <div className="relative h-56 overflow-hidden bg-stone-100 border-b border-stone-200/50">
                      {project.imageUrl ? (
                        <div className="relative h-full w-full overflow-hidden">
                          <img 
                            src={mediaUrl(project.imageUrl)} 
                            alt={project.title} 
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <div className={`relative h-full w-full bg-gradient-to-br ${project.palette} p-4 flex flex-col justify-end overflow-hidden`}>
                          {/* Grid Background Pattern */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
                          
                          {/* Premium Browser Window Mock */}
                          <div className="relative w-full rounded-lg border border-white/30 bg-white/90 p-4 text-stone-950 shadow-xl backdrop-blur-sm transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-red-400/80" />
                                <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                                <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                              </div>
                              <ExternalLink className="h-3 w-3 text-stone-400" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white shadow-md">
                                {(() => {
                                  const IconComponent = getIcon(project.iconName);
                                  return <IconComponent className="h-4.5 w-4.5 text-[#e7b464]" />;
                                })()}
                              </div>
                              <div className="flex-1 space-y-1.5">
                                <div className="h-2.5 w-2/3 rounded bg-stone-900" />
                                <div className="h-1.5 w-1/3 rounded bg-stone-300" />
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-1.5">
                              <div className="h-12 rounded bg-stone-100/70 border border-stone-200/30" />
                              <div className="h-12 rounded bg-stone-200/50 border border-stone-200/30" />
                              <div className="h-12 rounded bg-stone-100/70 border border-stone-200/30" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Floating Link Overlay for Images/Cards on hover */}
                      {hasLink && (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 z-10 flex items-center justify-center bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        >
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-stone-950 shadow-md transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                            {isWebsite ? "Visit Site" : "Launch App"}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </span>
                        </a>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a6a2d] bg-[#f6f2e8] px-2.5 py-1 rounded">
                          {project.category}
                        </span>
                      </div>
                      
                      <h3 className="mt-4 text-xl font-bold text-stone-950 tracking-tight group-hover:text-[#23443d] transition-colors duration-300">
                        {project.title}
                      </h3>
                      
                      <p className="mt-3 text-sm leading-relaxed text-stone-600 flex-1">
                        {project.description}
                      </p>
                      
                      {/* Performance Metrics */}
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        {project.metrics.slice(0, 2).map((metric) => (
                          <div key={metric} className="rounded-md border border-stone-200/60 bg-stone-50/50 px-2.5 py-2 text-center">
                            <span className="block text-[10px] text-stone-500 uppercase font-medium tracking-wide">Outcome</span>
                            <span className="mt-0.5 block text-xs font-bold text-stone-850 truncate">{metric}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                        {hasLink ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#23443d] hover:text-[#9a6a2d] transition-colors duration-300"
                          >
                            {isWebsite ? "Visit Live Site" : "Launch Production App"}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                            <Lock className="h-3 w-3" />
                            Enterprise Private Build
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
