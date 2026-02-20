"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 11, suffix: "", label: "Años de experiencia", prefix: "+" },
  { value: 4, suffix: "", label: "Líneas de producto", prefix: "" },
  { value: 4, suffix: "", label: "Industrias atendidas", prefix: "" },
  // TODO: confirmar número real de clientes con el cliente
  { value: 500, suffix: "+", label: "Clientes satisfechos", prefix: "" },
];


export default function CifrasClave() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    numbersRef.current.forEach((el, i) => {
      if (!el) return;
      const target = stats[i].value;
      const proxy = { val: 0 };

      gsap.to(proxy, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate() {
          if (el) el.textContent = Math.round(proxy.val).toString();
        },
      });
    });

    labelsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.1 + 0.3,
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-black to-dark-section relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <span className="text-xs tracking-[0.3em] uppercase text-secondary font-semibold mb-3 block">
            En números
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cifras que nos{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              definen
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center group">
              <div className="relative inline-flex items-baseline justify-center mb-2">
                {stat.prefix && (
                  <span className="text-2xl font-bold text-secondary mr-1">{stat.prefix}</span>
                )}
                <span
                  ref={(el) => { numbersRef.current[i] = el; }}
                  className="text-5xl md:text-6xl font-black text-white"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  0
                </span>
                {stat.suffix && (
                  <span className="text-2xl font-bold text-secondary ml-1">{stat.suffix}</span>
                )}
              </div>
              <div
                ref={(el) => { labelsRef.current[i] = el; }}
                className="text-text-secondary text-sm uppercase tracking-widest"
                style={{ opacity: 0 }}
              >
                {stat.label}
                {/* TODO: confirmar número de clientes con el cliente */}
                {stat.label === "Clientes satisfechos" && (
                  <span className="block text-xs text-primary/60 mt-1 normal-case tracking-normal">
                    (placeholder — confirmar)
                  </span>
                )}
              </div>
              <div className="mt-3 w-8 h-px bg-gradient-to-r from-primary to-secondary mx-auto group-hover:w-16 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
