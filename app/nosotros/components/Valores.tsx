"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: "◈",
    title: "Calidad",
    description:
      "Cada producto que distribuimos cumple con estándares internacionales. Rotoplas certifica lo que vendemos, nosotros certificamos cómo lo entregamos.",
  },
  {
    icon: "◎",
    title: "Confianza",
    description:
      "Más que vender productos, ofrecemos tranquilidad. Nos comprometemos con cada cliente en cada etapa, desde la cotización hasta la entrega.",
  },
  {
    icon: "◉",
    title: "Experiencia",
    description:
      "11 años resolviendo desafíos reales en almacenamiento industrial nos dan el conocimiento para asesorarte con precisión y seguridad.",
  },
  {
    icon: "⬡",
    title: "Cobertura",
    description:
      "Atendemos todo el territorio nacional con logística eficiente. Llegamos donde lo necesitas, con el respaldo de un equipo comprometido.",
  },
];

export default function Valores() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 30 },
        {
          clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0,
          duration: 0.4, ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.15,
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <span className="text-xs tracking-[0.3em] uppercase text-primary font-semibold mb-3 block">
            Lo que nos define
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Nuestros{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Valores
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((val, i) => (
            <div
              key={val.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group bg-white rounded-2xl p-7 shadow-md hover:shadow-xl border border-border hover:border-primary/30 transition-all duration-500 cursor-default"
              style={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
            >
              <div className="text-3xl mb-5 text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
                {val.icon}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
                {val.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
