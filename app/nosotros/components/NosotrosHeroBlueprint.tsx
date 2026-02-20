"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = ["Calidad", "Confianza", "Experiencia", "Troyani"];

export default function BlueprintHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3200",
          scrub: true,
          pin: true,
        },
      });

      values.forEach((_, i) => {
        const word = wordsRef.current[i];
        const line = linesRef.current[i];
        const isLast = i === values.length - 1;

        if (!word || !line) return;

        // Línea técnica horizontal
        tl.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            transformOrigin: "left center",
            ease: "power2.out",
          }
        );

        // Texto aparece como blueprint (outline)
        tl.fromTo(
          word,
          {
            opacity: 0,
            y: 30,
            WebkitTextStroke: "1px var(--color-secondary)",
            color: "transparent",
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "<"
        );

        tl.to({}, { duration: 0.8 });

        // Se rellena sólido
        tl.to(word, {
          color: isLast
            ? "var(--color-secondary)"
            : "var(--color-text-inverse)",
          WebkitTextStroke: "0px transparent",
          duration: 0.6,
          ease: "power2.out",
        });

        tl.to({}, { duration: 0.8 });

        if (!isLast) {
          tl.to(word, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power2.inOut",
          });

          tl.to(
            line,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.5,
              ease: "power2.inOut",
            },
            "<"
          );
        }
      });

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-dark-section)",
      }}
    >
      {/* Blueprint Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-secondary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-secondary) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative h-screen flex flex-col items-center justify-center text-center px-6">

        {/* Valores */}
        <div className="relative h-[220px] flex items-center justify-center">
          {values.map((value, i) => (
            <div key={value} className="absolute flex flex-col items-center">
              
              {/* Línea técnica */}
              <div
                ref={(el) => {(linesRef.current[i] = el)}}
                className="h-[2px] w-52 mb-6"
                style={{
                  backgroundColor: "var(--color-secondary)",
                  transform: "scaleX(0)",
                }}
              />

              {/* Texto */}
              <h2
                ref={(el) => {(wordsRef.current[i] = el)}}
                className="font-bold uppercase tracking-[0.2em]"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px var(--color-secondary)",
                }}
              >
                {value}
              </h2>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="mt-10"
          style={{
            opacity: 0,
            color: "var(--color-text-secondary)",
          }}
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-2">
            Inversiones
          </p>

          <div
            className="w-20 h-px mx-auto mb-4"
            style={{
              backgroundColor: "var(--color-secondary)",
            }}
          />

          <p
            className="max-w-xl mx-auto text-base"
            style={{
              color: "var(--color-text-light)",
            }}
          >
            Conoce la empresa detrás de cada solución de almacenamiento
          </p>
        </div>
      </div>
    </section>
  );
}