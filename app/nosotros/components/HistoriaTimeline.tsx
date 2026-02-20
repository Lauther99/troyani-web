"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    year: "2015",
    title: "El comienzo",
    description:
      "Troyani Inversiones nace en Perú con un propósito claro: llevar soluciones confiables de almacenamiento de agua y sustancias químicas a hogares, industrias y el sector agro.",
  },
  {
    year: "2016",
    title: "Alianza Rotoplas",
    description:
      "Nos convertimos en distribuidores autorizados de Rotoplas, una de las marcas líderes en soluciones de almacenamiento en Latinoamérica, garantizando calidad certificada en cada producto.",
  },
  {
    year: "2018",
    title: "Expansión industrial",
    description:
      "Ampliamos nuestro portafolio hacia los sectores pesquero y petrolero, incorporando tanques industriales de gran capacidad diseñados bajo normativa específica para cada industria.",
  },
  {
    year: "2021",
    title: "Cobertura nacional",
    description:
      "Alcanzamos presencia en todo el territorio peruano, consolidando una red logística que garantiza entregas seguras, rápidas y eficientes a cada rincón del país.",
  },
  {
    year: "2026",
    title: "Hoy",
    description:
      "Con 11 años de trayectoria, seguimos creciendo y comprometidos con ofrecer la mejor experiencia a nuestros clientes, innovando en cada solución que entregamos.",
  },
];

export default function HistoriaTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.8,
          },
        },
      );
    }

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const xFrom = isMobile ? 50 : i % 2 === 0 ? -60 : 60;
      gsap.fromTo(
        item,
        { opacity: 0, x: xFrom, filter: "blur(8px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: 0.1,
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0066CC 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 md:mb-20"
          style={{ opacity: 0 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-3 block">
            Nuestra trayectoria
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Historia que{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              nos respalda
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto" />
        </div>

        {/* Timeline — un solo DOM */}
        <div className="relative">
          {/* Línea: left-5 en mobile, centrada en desktop */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-primary via-secondary to-primary"
              style={{ scale: 0, transformOrigin: "top center" }}
            />
          </div>

          <div className="space-y-10 md:space-y-16">
            {timelineItems.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.year}
                  ref={(el) => { itemsRef.current[i] = el; }}
                  style={{ opacity: 0 }}
                  className={[
                    "relative flex items-center gap-4 md:gap-8",
                    "pl-12 md:pl-0",
                    isLeft ? "md:flex-row" : "md:flex-row-reverse",
                  ].join(" ")}
                >
                  {/* Dot — absoluto en mobile, en flujo en desktop */}
                  <div className="absolute left-[0.9rem] md:static relative z-10 flex-shrink-0">
                    <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40" />
                    <div
                      className="absolute inset-0 rounded-full bg-primary/20 scale-[2.5] animate-ping"
                      style={{ animationDuration: "3s" }}
                    />
                  </div>

                  {/* Card */}
                  <div className={`w-full md:flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div
                      className={`bg-white rounded-2xl p-5 md:p-6 shadow-md border border-border hover:shadow-xl transition-shadow duration-300 md:max-w-sm ${isLeft ? "md:ml-auto" : "md:mr-auto"}`}
                    >
                      <span className="text-xs tracking-widest uppercase text-text-light font-medium">
                        {item.year}
                      </span>
                      <h3 className="text-base md:text-lg font-bold text-text-primary mt-1 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Year watermark — solo desktop */}
                  <div className={`hidden md:block md:flex-1 ${isLeft ? "md:text-left" : "md:text-right"}`}>
                    <span
                      className="text-5xl font-bold opacity-10 text-text-primary select-none"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {item.year}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
