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
    // Usamos gsap.context para poder limpiar todas las animaciones fácilmente en React
    const ctx = gsap.context(() => {
      // Header fade in
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

      // Timeline line draws itself
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.5,
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

      // matchMedia para animaciones Responsive
      const mm = gsap.matchMedia();

      // Animación en ESCRITORIO (Deslizamiento horizontal)
      mm.add("(min-width: 768px)", () => {
        itemsRef.current.forEach((item, i) => {
          if (!item) return;
          const isLeft = i % 2 === 0;
          gsap.fromTo(
            item,
            { opacity: 0, x: isLeft ? -60 : 60, filter: "blur(8px)" },
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
      });

      // Animación en MÓVIL (Deslizamiento vertical)
      mm.add("(max-width: 767px)", () => {
        itemsRef.current.forEach((item) => {
          if (!item) return;
          gsap.fromTo(
            item,
            { opacity: 0, y: 40, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert(); // Cleanup robusto de GSAP
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Subtle background texture */}
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
          className="text-center mb-16 md:mb-20"
          style={{ opacity: 0 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-3 block">
            Nuestra trayectoria
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Historia que{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              nos respalda
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line: Izquierda en móvil (left-6), centro en escritorio (md:left-1/2) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-px z-0">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-primary via-secondary to-primary"
              style={{ scale: 0, transformOrigin: "top center" }}
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {timelineItems.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.year}
                  ref={(el) => {
                    itemsRef.current[i] = el;
                  }}
                  className={`relative flex flex-col md:flex-row md:items-center md:gap-8 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  style={{ opacity: 0 }}
                >
                  {/* Content: Tarjeta */}
                  <div
                    className={`w-full md:flex-1 pl-16 md:pl-0 ${
                      isLeft ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div
                      className={`inline-block text-left w-full sm:max-w-sm bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow duration-300 ${
                        isLeft ? "md:ml-auto" : "md:mr-auto"
                      }`}
                    >
                      <span className="text-xs tracking-widest uppercase text-text-light font-medium">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold text-text-primary mt-1 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Dot: Sobre la línea izquierda en móvil, centrado en escritorio */}
                  <div className="absolute left-6 top-8 md:static md:top-auto md:left-auto flex-shrink-0 z-10 transform -translate-x-1/2 md:translate-x-0">
                    <div className="relative w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40">
                      <div
                        className="absolute inset-0 rounded-full bg-primary/20 scale-[2.5] animate-ping"
                        style={{ animationDuration: "3s" }}
                      />
                    </div>
                  </div>

                  {/* Year label: Oculto en móvil, visible en escritorio (Lado opuesto) */}
                  <div
                    className={`hidden md:block flex-1 ${
                      isLeft ? "text-left" : "text-right"
                    }`}
                  >
                    <span
                      className="text-5xl font-bold opacity-50 text-text-primary select-none"
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
