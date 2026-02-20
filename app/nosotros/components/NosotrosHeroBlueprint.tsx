"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = ["Calidad", "Confianza", "Experiencia", "Troyani"];

export default function NosotrosBlueprintHero() {
  const sectionRef = useRef<HTMLElement>(null);
  // FIX: refs separados para líneas y palabras
  const wordsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // FIX: ocultar TODAS las palabras y líneas al inicio — solo se verá la 1ra cuando arranque
      wordsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          opacity: i === 0 ? 0 : 0, // todas ocultas, la timeline las irá revelando
          y: i === 0 ? 30 : 0,
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,163,224,0.8)",
        });
      });
      linesRef.current.forEach((el) => {
        if (el) gsap.set(el, { scaleX: 0 });
      });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 0, y: 40 });

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
        const line = linesRef.current[i]; // FIX: ahora apunta al ref correcto
        const isLast = i === values.length - 1;

        if (!word || !line) return;

        // Línea técnica horizontal se dibuja
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

        // Texto aparece como blueprint (stroke visible primero)
        tl.fromTo(
          word,
          {
            opacity: 0,
            WebkitTextStroke: "1px rgba(0,163,224,0.8)",
            color: "transparent",
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "<", // simultáneo con la línea
        );

        // Pausa para que el usuario lo lea
        tl.to({}, { duration: 0.8 });

        // Relleno sólido (stroke desaparece, color aparece)
        tl.to(word, {
          color: isLast ? "#00A3E0" : "#ffffff",
          WebkitTextStroke: "0px transparent",
          duration: 0.6,
          ease: "power2.out",
        });

        // Otra pausa
        tl.to({}, { duration: 0.8 });

        if (!isLast) {
          // Sale hacia arriba
          tl.to(word, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power2.inOut",
          });
          // Línea se borra desde la derecha
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

      // Subtitle aparece después de "Troyani"
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative text-white overflow-hidden"
      style={{ backgroundColor: "#071A2B" }}
    >
      {/* Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,163,224,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,163,224,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        {/* Valores Blueprint — apilados absolutamente, uno visible a la vez */}
        <div className="relative h-[220px] flex items-center justify-center">
          {values.map((value, i) => (
            <div
              key={value}
              className="absolute flex flex-col items-center"
            >
              {/* FIX: ref correcto para la línea → linesRef */}
              <div
                ref={(el) => { linesRef.current[i] = el; }}
                className="h-[2px] w-52 bg-[#00A3E0] mb-6"
                style={{ transform: "scaleX(0)" }}
              />
              {/* FIX: ref correcto para la palabra → wordsRef */}
              <h2
                ref={(el) => { wordsRef.current[i] = el; }}
                className="font-bold uppercase tracking-[0.2em]"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(0,163,224,0.8)",
                  opacity: 0, // FIX: oculto al cargar — ninguna palabra visible inicialmente
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
          className="mt-10 text-[#8FBFD6]"
          style={{ opacity: 0 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-2">Inversiones</p>
          <div className="w-20 h-px bg-[#00A3E0] mx-auto mb-4" />
          <p className="max-w-xl mx-auto text-base">
            Conoce la empresa detrás de cada solución de almacenamiento
          </p>
        </div>
      </div>
    </section>
  );
}
