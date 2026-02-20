"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Award, CheckCircle, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Clock,
    title: "Más de 9 años de experiencia",
    description:
      "Desde 2015 brindamos soluciones confiables en almacenamiento de agua y sustancias químicas en todo el Perú.",
    features: ["Empresa peruana", "Experiencia comprobada", "Trayectoria sólida"],
    from: "left", // slide direction
  },
  {
    icon: Award,
    title: "Distribuidores autorizados Rotoplas",
    description:
      "Ofrecemos productos de polietileno de alta calidad con respaldo oficial de la marca Rotoplas.",
    features: ["Marca reconocida", "Productos certificados", "Respaldo oficial"],
    from: "bottom",
  },
  {
    icon: Shield,
    title: "Abastecimiento seguro y confiable",
    description:
      "Nos comprometemos con entregas seguras, eficientes y puntuales en todo el territorio nacional.",
    features: ["Cobertura nacional", "Logística confiable", "Entrega puntual"],
    from: "right",
  },
];

const years = new Date().getFullYear() - 2015;
const stats = [
  { number: 100, suffix: "%", label: "Distribuidor Autorizado Rotoplas", icon: Award },
  { number: years,  suffix: "+", label: "Años de Experiencia",            icon: Clock },
  { number: 100, suffix: "%", label: "Cobertura Nacional",               icon: CheckCircle },
];

export default function WhyTroyani() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<(HTMLDivElement | null)[]>([]);
  const statsBoxRef = useRef<HTMLDivElement>(null);
  const numRefs     = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // ─── Header fade ──────────────────────────────────────────────────────
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
        }
      );
    }

    // ─── Benefit cards: converge from sides ───────────────────────────────
    const directionMap: Record<string, { x?: number; y?: number }> = {
      left:   { x: -80, y: 0  },
      bottom: { x: 0,   y: 60 },
      right:  { x: 80,  y: 0  },
    };

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const dir = directionMap[benefits[i].from];

      gsap.fromTo(
        card,
        { opacity: 0, x: dir.x, y: dir.y },
        {
          opacity: 1, x: 0, y: 0,
          duration: 1.0,
          ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ─── Stats box fade + scale ───────────────────────────────────────────
    if (statsBoxRef.current) {
      gsap.fromTo(
        statsBoxRef.current,
        { opacity: 0, scale: 0.96, y: 32 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: {
            trigger: statsBoxRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            onEnter: () => animateCounters(), // fire counters when box enters
          },
        }
      );
    }

    // ─── Number counters ──────────────────────────────────────────────────
    function animateCounters() {
      numRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].number;
        const proxy  = { val: 0 };

        gsap.to(proxy, {
          val: target,
          duration: 2.0,
          ease: "power2.out",
          delay: i * 0.2,
          onUpdate() {
            el.textContent = Math.round(proxy.val).toString();
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="beneficios"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            ¿Por qué elegir Troyani?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6" />
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Más de 9 años brindando soluciones de almacenamiento industrial con
            los más altos estándares de calidad
          </p>
        </div>

        {/* ── Benefits Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                ref={(el) => { cardsRef.current[index] = el; }}
                style={{ opacity: 0 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {benefit.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full -z-10" />
              </div>
            );
          })}
        </div>

        {/* ── Stats Section ─────────────────────────────────────────────── */}
        <div
          ref={statsBoxRef}
          style={{ opacity: 0 }}
          className="bg-gradient-to-br from-dark-section to-black rounded-3xl p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Animated number */}
                  <div className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    <span ref={(el) => { numRefs.current[index] = el; }}>0</span>
                    {stat.suffix}
                  </div>

                  <div className="text-gray-300 font-medium text-lg">
                    {stat.label}
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
