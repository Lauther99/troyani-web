"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { phoneNumber } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScrolled() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const letters = "TROYANI".split("");

  useEffect(() => {
    const section = sectionRef.current!;
    const content = contentRef.current!;
    const arrow = arrowRef.current!;

    // Each letter gets ~10% of the total scroll for its own animation.
    // 7 letters × 10% = 70% used for the title reveal.
    // Remaining 30% is split: content fade-in (10%) + exit (20%).
    //
    // Total section height = 400vh so there's plenty of room.

    const LETTER_WINDOW = 10; // % of total scroll per letter
    const STAGGER = 8; // % offset between letter starts

    // ─── Arrow vanishes on first scroll ──────────────────────────────────
    gsap.to(arrow, {
      opacity: 0,
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "3% top",
        scrub: true,
      },
    });

    // ─── Each letter: giant → 360° rotateY → normal size ─────────────────
    letters.forEach((_, i) => {
      const el = lettersRef.current[i];
      if (!el) return;

      const startPct = 2 + i * STAGGER; // e.g. T=2%, R=10%, O=18%…
      const endPct = startPct + LETTER_WINDOW + 4; // each has ~14% window

      // Phase 1 — 0→180°: letter is huge and spinning (first half of window)
      // Phase 2 — 180→360°: letter shrinks to final size (second half)
      // We achieve this with a keyframe-style tween on a proxy object.

      const proxy = { rot: 0, scale: 8, opacity: 0 };

      ScrollTrigger.create({
        trigger: section,
        start: `${startPct}% top`,
        end: `${endPct}% top`,
        scrub: 1.4,
        onUpdate(self) {
          const p = self.progress; // 0 → 1

          // Rotation: 0 → 360 (full spin)
          const rot = p * 360 * 3;

          // Scale: starts at 8× (huge), eases to 1× after 60% of window
          // so it feels like it "lands" before the spin fully ends
          const scalePct = Math.min(p / 0.7, 1); // normalise 0–70% → 0–1
          const scale = 8 - 7 * scalePct; // 8 → 1

          // Opacity: fade in during first 20% of window
          const opacity = Math.min(p / 0.2, 1);

          if (el) {
            gsap.set(el, {
              rotateY: rot,
              scale,
              opacity,
              transformOrigin: "center center",
            });
          }
        },
      });
    });

    // ─── Subtitle ─────────────────────────────────────────────────────────
    const contentStart = 2 + (letters.length - 1) * STAGGER + LETTER_WINDOW + 6;
    // ≈ 2 + 48 + 14 = 64%

    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: `${contentStart}% top`,
            end: `${contentStart + 7}% top`,
            scrub: 1,
          },
        },
      );
    }

    // ─── Description ──────────────────────────────────────────────────────
    if (descRef.current) {
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: `${contentStart + 6}% top`,
            end: `${contentStart + 13}% top`,
            scrub: 1,
          },
        },
      );
    }

    // ─── CTA buttons ──────────────────────────────────────────────────────
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: `${contentStart + 12}% top`,
            end: `${contentStart + 18}% top`,
            scrub: 1,
          },
        },
      );
    }

    // ─── Exit: blur + fade + scale (kept as requested) ────────────────────
    gsap.to(content, {
      opacity: 0,
      scale: 0.92,
      filter: "blur(14px)",
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "83% top",
        end: "97% top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    // 400vh = lots of scroll room for the 7-letter cascade + content + exit
    <section
      ref={sectionRef}
      id="inicio"
      className="relative bg-white"
      style={{ height: "400vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden pt-20">
        <div
          ref={contentRef}
          className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center"
        >
          {/* ── TROYANI letters ─────────────────────────────────────────── */}
          <div
            className="mb-6 flex justify-center items-center gap-1 md:gap-2"
            style={{ perspective: "600px" }}
          >
            {letters.map((letter, i) => (
              <span
                key={i}
                ref={(el) => {
                  lettersRef.current[i] = el;
                }}
                className="
                  text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                  font-bold
                  bg-gradient-to-br from-primary to-secondary
                  bg-clip-text text-transparent
                  inline-block
                "
                style={{
                  opacity: 0,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          {/* ── Subtitle ────────────────────────────────────────────────── */}
          <div
            ref={subtitleRef}
            style={{ opacity: 0 }}
            className="text-xl sm:text-2xl md:text-3xl font-light text-text-secondary mb-4"
          >
            Inversiones
          </div>

          {/* ── Description ─────────────────────────────────────────────── */}
          <p
            ref={descRef}
            style={{ opacity: 0 }}
            className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8"
          >
            Soluciones de almacenamiento industrial certificadas para el
            almacenamiento de fluidos con estándares internacionales de calidad.
          </p>

          {/* ── CTA Buttons ─────────────────────────────────────────────── */}
          <div
            ref={ctaRef}
            style={{ opacity: 0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Contactar por WhatsApp</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>

            <a
              href="#productos"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Ver Catálogo Completo
            </a>
          </div>
        </div>

        {/* ── Scroll arrow — fades on first scroll ────────────────────────── */}
        <div
          ref={arrowRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-light pointer-events-none"
        >
          <span className="text-sm font-medium tracking-wide">
            Descubre más
          </span>
          <svg
            className="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
