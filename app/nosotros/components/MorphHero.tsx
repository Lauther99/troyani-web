"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const morphWords = ["Calidad", "Confianza", "Experiencia", "Troyani"];

export default function MorphHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;

    // ── FIX: inicializar TODAS las palabras en hidden antes de crear triggers ──
    wordsRef.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, scale: 0.85, filter: "blur(20px)" });
    });
    if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 0, y: 32 });
    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });

    // ── FIX: esperar al paint final para que ScrollTrigger calcule bien los px ──
    // Sin este refresh, si el navbar u otro elemento cambia la altura del layout
    // después del primer render, los triggers quedan desfasados.
    const rafId = requestAnimationFrame(() => { ScrollTrigger.refresh(); });

    const WORD_WINDOW = 22;
    const WORD_STAGGER = 18;

    wordsRef.current.forEach((el, i) => {
      if (!el) return;

      const startPct = 2 + i * WORD_STAGGER;
      const endPct = startPct + WORD_WINDOW;
      const isLast = i === morphWords.length - 1;

      ScrollTrigger.create({
        trigger: section,
        start: `${startPct}% top`,
        end: `${endPct}% top`,
        scrub: 1.2,
        // FIX: forzar estado inicial cuando el scroll está ANTES del trigger
        onLeaveBack() {
          gsap.set(el, { opacity: 0, scale: 0.85, filter: "blur(20px)" });
        },
        // FIX: forzar estado final cuando el scroll pasa el END del trigger
        onLeave() {
          if (isLast) {
            // La última palabra se queda visible
            gsap.set(el, { opacity: 1, scale: 1, filter: "blur(0px)" });
          } else {
            // Las demás desaparecen completamente al salir
            gsap.set(el, { opacity: 0, scale: 1.3, filter: "blur(20px)" });
          }
        },
        onUpdate(self) {
          const p = self.progress;

          if (!isLast) {
            let opacity: number;
            let scale: number;
            let blur: number;

            if (p < 0.3) {
              // Fade in
              opacity = p / 0.3;
              scale = 0.85 + 0.15 * (p / 0.3);
              blur = 20 * (1 - p / 0.3);
            } else if (p < 0.65) {
              // Hold
              opacity = 1;
              scale = 1;
              blur = 0;
            } else {
              // Morph out
              const exitP = (p - 0.65) / 0.35;
              opacity = 1 - exitP;
              scale = 1 + 0.3 * exitP;
              blur = 20 * exitP;
            }

            gsap.set(el, { opacity, scale, filter: `blur(${blur}px)` });
          } else {
            // Última palabra: solo entra, nunca sale
            if (p < 0.4) {
              const inP = p / 0.4;
              gsap.set(el, {
                opacity: inP,
                scale: 0.85 + 0.15 * inP,
                filter: `blur(${20 * (1 - inP)}px)`,
              });
            } else {
              gsap.set(el, { opacity: 1, scale: 1, filter: "blur(0px)" });
            }
          }
        },
      });
    });

    // ── Subtitle ──────────────────────────────────────────────────────────────
    const subtitleStart =
      2 + (morphWords.length - 1) * WORD_STAGGER + WORD_WINDOW * 0.4;

    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: `${subtitleStart}% top`,
            end: `${subtitleStart + 8}% top`,
            scrub: 1,
            onLeaveBack() {
              if (subtitleRef.current)
                gsap.set(subtitleRef.current, { opacity: 0, y: 32 });
            },
          },
        },
      );
    }

    // ── Overlay exit ──────────────────────────────────────────────────────────
    if (overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "82% top",
            end: "97% top",
            scrub: true,
          },
        },
      );
    }

    return () => {
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-section"
      style={{ height: "480vh" }}
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,163,224,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,224,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* pt-20 compensa el navbar fijo (80px). Sin esto las palabras quedan cortadas arriba */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Overlay for exit */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-dark-section pointer-events-none z-10"
          style={{ opacity: 0 }}
        />

        {/* Morphing words — stacked absolutely */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{ height: "35vh" }}
        >
          {morphWords.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="absolute text-center font-bold select-none"
              style={{
                // opacity: 0 aquí también como estado inicial del DOM
                opacity: 0,
                fontSize: "clamp(3.5rem, 12vw, 9rem)",
                background:
                  i === morphWords.length - 1
                    ? "linear-gradient(135deg, #0066CC 0%, #00A3E0 50%, #0066CC 100%)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing:
                  i === morphWords.length - 1 ? "0.15em" : "0.05em",
                willChange: "transform, opacity, filter",
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="text-center px-4"
          style={{ opacity: 0 }}
        >
          <p className="text-xl md:text-2xl text-text-secondary font-light tracking-widest uppercase mb-2">
            Inversiones
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mb-4" />
          <p className="text-base md:text-lg text-text-light max-w-xl mx-auto">
            Conoce la empresa detrás de cada solución de almacenamiento
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-light pointer-events-none">
          <span className="text-xs tracking-widest uppercase">Desliza</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
