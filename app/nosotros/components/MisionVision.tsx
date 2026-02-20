"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MisionVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const misionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

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

    // Misión: clip from left
    if (misionRef.current) {
      gsap.fromTo(
        misionRef.current,
        { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
          duration: 1.4, ease: "power3.out",
          scrollTrigger: {
            trigger: misionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Visión: clip from right
    if (visionRef.current) {
      gsap.fromTo(
        visionRef.current,
        { clipPath: "inset(0% 0% 0% 100%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
          duration: 1.4, ease: "power3.out",
          scrollTrigger: {
            trigger: visionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          delay: 0.2,
        },
      );
    }

    // Divider draws from center
    if (dividerRef.current) {
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1, ease: "power2.out",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-dark-section to-black relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <span className="text-xs tracking-[0.3em] uppercase text-secondary font-semibold mb-3 block">
            Nuestro propósito
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Por qué existimos
          </h2>
          <div
            ref={dividerRef}
            className="w-24 h-px bg-gradient-to-r from-primary to-secondary mx-auto"
            style={{ scale: 0, transformOrigin: "center" }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Misión */}
          <div
            ref={misionRef}
            className="relative rounded-3xl overflow-hidden border border-white/10 p-8 md:p-10"
            style={{
              clipPath: "inset(0% 100% 0% 0%)",
              opacity: 0,
              background: "linear-gradient(135deg, rgba(0,102,204,0.15) 0%, rgba(0,102,204,0.05) 100%)",
            }}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent" />
            <div className="text-5xl mb-6 opacity-60">◎</div>
            <h3 className="text-2xl font-bold text-white mb-4">Misión</h3>
            <p className="text-text-secondary leading-relaxed text-lg">
              Brindar soluciones confiables en almacenamiento de agua y sustancias químicas, 
              ofreciendo productos certificados de primera calidad, con atención personalizada 
              y un servicio seguro, eficiente y puntual para cada cliente en todo el Perú.
            </p>
          </div>

          {/* Visión */}
          <div
            ref={visionRef}
            className="relative rounded-3xl overflow-hidden border border-white/10 p-8 md:p-10"
            style={{
              clipPath: "inset(0% 0% 0% 100%)",
              opacity: 0,
              background: "linear-gradient(135deg, rgba(0,163,224,0.15) 0%, rgba(0,163,224,0.05) 100%)",
            }}
          >
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-secondary to-transparent" />
            <div className="text-5xl mb-6 opacity-60">◈</div>
            <h3 className="text-2xl font-bold text-white mb-4">Visión</h3>
            <p className="text-text-secondary leading-relaxed text-lg">
              Ser el distribuidor de referencia en soluciones de almacenamiento industrial 
              en el Perú, reconocidos por la excelencia en nuestros productos, la confiabilidad 
              de nuestra logística y el impacto positivo que generamos en cada cliente que atendemos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}