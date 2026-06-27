import { ArrowRight, ExternalLink } from "lucide-react";
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
    <section id="portfolio" className="border-b border-stone-200/30 bg-[#e8f0ee] py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="section-container">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9a6a2d]">Portfolio</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-950 sm:text-5xl">
              Website and software builds shaped for real businesses.
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-950 shadow-sm transition-all duration-300 hover:bg-[#23443d] hover:text-white hover:border-[#23443d] hover:shadow"
          >
            Request a similar build
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="portfolio-slider relative mt-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-16 !px-1"
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id} className="h-auto">
                <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5 hover:border-[#23443d]/30 hover:shadow-xl">
                  <div className="relative h-56 overflow-hidden">
                    {project.imageUrl ? (
                      <img 
                        src={mediaUrl(project.imageUrl)} 
                        alt={project.title} 
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className={`relative h-full w-full bg-gradient-to-br ${project.palette} p-5`}>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:34px_34px]" />
                        <div className="relative h-full rounded-md border border-white/25 bg-white/85 p-4 text-stone-950 shadow-xl">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            </div>
                            <ExternalLink className="h-4 w-4 text-stone-500" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-stone-950 text-white shadow-md">
                              {(() => {
                                const IconComponent = getIcon(project.iconName);
                                return <IconComponent className="h-5 w-5" />;
                              })()}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-3/4 rounded bg-stone-900" />
                              <div className="h-2 w-1/2 rounded bg-stone-300" />
                            </div>
                          </div>
                          <div className="mt-5 grid grid-cols-3 gap-2">
                            <div className="h-16 rounded bg-stone-100/80" />
                            <div className="h-16 rounded bg-stone-200/80" />
                            <div className="h-16 rounded bg-stone-100/80" />
                          </div>
                          <div className="mt-4 h-8 w-32 rounded bg-[#23443d]" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a6a2d]">{project.category}</p>
                    <h3 className="mt-3 text-xl font-bold text-stone-950">{project.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-700 flex-1">{project.description}</p>
                    <div className="mt-5 grid gap-2">
                      {project.metrics.map((metric) => (
                        <span key={metric} className="rounded-md bg-[#f6f2e8] px-3 py-2 text-xs font-bold text-stone-700">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
