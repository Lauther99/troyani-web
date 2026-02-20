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
    const mm = gsap.matchMedia(sectionRef);

    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      },
      (context) => {
        const { isMobile } = context.conditions as {
          isMobile: boolean;
          isDesktop: boolean;
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: isMobile ? "+=2600" : "+=3200",
            scrub: true,
            pin: true,
          },
        });

        if (isMobile) {
          /* =========================================
             Animación para MÓVILES (Stack -> Troyani)
             ========================================= */
          const firstThree = [0, 1, 2];
          const lastIndex = 3;

          // 1. Aparecen las 3 primeras palabras apiladas y se quedan en pantalla
          firstThree.forEach((i) => {
            const word = wordsRef.current[i];
            const line = linesRef.current[i];

            tl.fromTo(
              line,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.5, transformOrigin: "left center", ease: "power2.out" }
            );
            tl.fromTo(
              word,
              { opacity: 0, y: 15, WebkitTextStroke: "1px var(--color-secondary)", color: "transparent" },
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
              "<"
            );

            // Relleno sólido
            tl.to(
              word,
              { color: "var(--color-text-inverse)", WebkitTextStroke: "0px transparent", duration: 0.5, ease: "power2.out" },
              "+=0.1" // Pequeño retraso para que fluya natural
            );
          });

          // 2. Pausa para apreciar las 3 palabras juntas
          tl.to({}, { duration: 1.2 });

          // 3. Empieza la transición: Desaparecen las 3 juntas y APARECE Troyani
          const elementsToHide = firstThree.flatMap((i) => [
            wordsRef.current[i],
            linesRef.current[i],
          ]);

          // Añadimos una "etiqueta" (label) a la línea de tiempo para sincronizar eventos
          tl.add("transicionTroyani");

          tl.to(
            elementsToHide,
            { opacity: 0, y: -20, duration: 0.6, stagger: 0.05, ease: "power2.inOut" },
            "transicionTroyani"
          );

          // 4. Aparece "Troyani" (Inicia un milisegundo después de que empiezan a desaparecer las demás)
          const troyaniWord = wordsRef.current[lastIndex];
          const troyaniLine = linesRef.current[lastIndex];

          tl.fromTo(
            troyaniLine,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, transformOrigin: "left center", ease: "power2.out" },
            "transicionTroyani+=0.2"
          );
          tl.fromTo(
            troyaniWord,
            { opacity: 0, scale: 0.9, y: 20, WebkitTextStroke: "1px var(--color-secondary)", color: "transparent" },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "<"
          );

          tl.to(troyaniWord, {
            color: "var(--color-secondary)",
            WebkitTextStroke: "0px transparent",
            duration: 0.6,
            ease: "power2.out",
          });

          // 5. Aparece Subtítulo final justo debajo
          if (subtitleRef.current) {
            tl.fromTo(
              subtitleRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
              "-=0.2"
            );
          }
        } else {
          /* =========================================
             Animación para ESCRITORIO (Original)
             ========================================= */
          values.forEach((_, i) => {
            const word = wordsRef.current[i];
            const line = linesRef.current[i];
            const isLast = i === values.length - 1;

            if (!word || !line) return;

            tl.fromTo(
              line,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.6, transformOrigin: "left center", ease: "power2.out" }
            );
            tl.fromTo(
              word,
              { opacity: 0, y: 30, WebkitTextStroke: "1px var(--color-secondary)", color: "transparent" },
              { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
              "<"
            );

            tl.to({}, { duration: 0.8 });

            tl.to(word, {
              color: isLast ? "var(--color-secondary)" : "var(--color-text-inverse)",
              WebkitTextStroke: "0px transparent",
              duration: 0.6,
              ease: "power2.out",
            });

            tl.to({}, { duration: 0.8 });

            if (!isLast) {
              tl.to(word, { opacity: 0, y: -30, duration: 0.6, ease: "power2.inOut" });
              tl.to(line, { scaleX: 0, transformOrigin: "right center", duration: 0.5, ease: "power2.inOut" }, "<");
            }
          });

          if (subtitleRef.current) {
            tl.fromTo(
              subtitleRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
          }
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-dark-section)" }}
    >
      {/* Blueprint Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-secondary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-secondary) 1px, transparent 1px)
          `,
          backgroundSize: "clamp(40px, 8vw, 60px) clamp(40px, 8vw, 60px)",
        }}
      />

      {/* Contenedor Principal Absoluto para sobreponer capas */}
      <div className="relative h-screen w-full flex items-center justify-center text-center px-4 md:px-6">
        
        {/* CAPA 1: Las 3 primeras palabras */}
        <div className="absolute inset-0 flex flex-col md:block items-center justify-center w-full gap-6 md:gap-0 pointer-events-none">
          {values.slice(0, 3).map((value, i) => (
            <div
              key={value}
              className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex flex-col items-center"
            >
              <div
                ref={(el) => { linesRef.current[i] = el; }}
                className="h-[2px] w-16 md:w-52 mb-2 md:mb-6"
                style={{ backgroundColor: "var(--color-secondary)", transform: "scaleX(0)" }}
              />
              <h2
                ref={(el) => { wordsRef.current[i] = el; }}
                className="font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap"
                style={{
                  opacity: 0,
                  fontSize: "clamp(1.75rem, 7vw, 6rem)",
                }}
              >
                {value}
              </h2>
            </div>
          ))}
        </div>

        {/* CAPA 2: "Troyani" y el Subtítulo (perfectamente centrados) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center w-full pointer-events-none">
          {/* Palabra Troyani (Índice 3) */}
          <div className="flex flex-col items-center">
            <div
              ref={(el) => { linesRef.current[3] = el; }}
              className="h-[2px] w-24 md:w-52 mb-2 md:mb-6"
              style={{ backgroundColor: "var(--color-secondary)", transform: "scaleX(0)" }}
            />
            <h2
              ref={(el) => { wordsRef.current[3] = el; }}
              className="font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap"
              style={{
                opacity: 0,
                fontSize: "clamp(2rem, 10vw, 6rem)",
              }}
            >
              {values[3]}
            </h2>
          </div>

          {/* Subtítulo justito debajo */}
          <div
            ref={subtitleRef}
            className="mt-6 md:mt-10 px-4"
            style={{ opacity: 0, color: "var(--color-text-secondary)" }}
          >
            <p className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase mb-2">
              Inversiones
            </p>
            <div
              className="w-16 md:w-20 h-px mx-auto mb-4"
              style={{ backgroundColor: "var(--color-secondary)" }}
            />
            <p
              className="max-w-xl mx-auto text-sm md:text-base leading-relaxed"
              style={{ color: "var(--color-text-light)" }}
            >
              Conoce la empresa detrás de cada solución de almacenamiento
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}