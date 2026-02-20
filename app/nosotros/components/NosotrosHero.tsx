"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = ["Calidad", "Confianza", "Experiencia", "Troyani"];

export default function NosotrosHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          scrub: true,
          pin: true,
        },
      });

      values.forEach((_, i) => {
        const word = wordsRef.current[i];
        const line = linesRef.current[i];
        const isLast = i === values.length - 1;

        if (!word || !line) return;

        // Línea se dibuja
        tl.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            transformOrigin: "left center",
            ease: "power2.out",
          },
        );

        // Texto aparece sólido
        tl.fromTo(
          word,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "<",
        );

        tl.to({}, { duration: 0.8 }); // hold elegante

        if (!isLast) {
          tl.to(
            word,
            {
              opacity: 0,
              y: -30,
              duration: 0.5,
              ease: "power2.inOut",
            },
            ">",
          );

          tl.to(
            line,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.5,
              ease: "power2.inOut",
            },
            "<",
          );
        }
      });

      // Subtitle final
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-section text-white"
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        {/* Valores */}
        <div className="relative h-[200px] flex items-center justify-center">
          {values.map((value, i) => (
            <div
              key={value}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="absolute flex flex-col items-center"
              style={{ opacity: 0 }}
            >
              <div
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className="h-[2px] w-40 bg-gradient-to-r from-secondary to-primary mb-6"
                style={{ transform: "scaleX(0)" }}
              />
              <h2
                className={`font-bold tracking-[0.15em] uppercase ${
                  i === values.length - 1 ? "text-secondary" : "text-white"
                }`}
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                }}
              >
                {value}
              </h2>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} style={{ opacity: 0 }}>
          <p className="text-xl tracking-widest uppercase text-text-secondary mb-2">
            Inversiones
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mb-4" />
          <p className="max-w-xl mx-auto text-text-light">
            Conoce la empresa detrás de cada solución de almacenamiento
          </p>
        </div>
      </div>
    </section>
  );
}
