"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = ["Calidad", "Confianza", "Experiencia", "Troyani"];

export default function NosotrosHero3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3500",
          scrub: true,
          pin: true,
        },
      });

      values.forEach((_, i) => {
        const word = wordsRef.current[i];
        const isLast = i === values.length - 1;

        if (!word) return;

        tl.fromTo(
          word,
          {
            opacity: 0,
            z: -400,
            rotateX: 25,
            scale: 0.9,
          },
          {
            opacity: 1,
            z: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          },
        );

        tl.to({}, { duration: 0.8 }); // hold

        if (!isLast) {
          tl.to(word, {
            opacity: 0,
            z: 250,
            scale: 1.1,
            duration: 0.8,
            ease: "power3.inOut",
          });
        }
      });

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        );
      }

      // Parallax background depth
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: -200,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-section text-white overflow-hidden"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background depth layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(0,163,224,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        {/* 3D Words */}
        <div
          className="relative h-[200px] flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {values.map((value, i) => (
            <h2
              key={value}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="absolute font-bold uppercase tracking-[0.15em]"
              style={{
                opacity: 0,
                fontSize: "clamp(3rem, 8vw, 6rem)",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                background:
                  i === values.length - 1
                    ? "linear-gradient(135deg, #0066CC 0%, #00A3E0 100%)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {value}
            </h2>
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
