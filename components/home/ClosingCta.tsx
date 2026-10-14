"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { whatsappUrl } from "@/lib/whatsapp";

function wavePath(t: number, amp: number, freq: number, phase: number, base: number) {
  let d = `M0 200 L0 ${base}`;
  for (let x = 0; x <= 1440; x += 40) {
    const y =
      base +
      Math.sin((x / 1440) * Math.PI * 2 * freq + t + phase) * amp +
      Math.sin((x / 1440) * Math.PI * 2 * (freq * 0.5) - t * 0.6 + phase) * amp * 0.5;
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d + " L1440 200 Z";
}

export default function ClosingCta({ respuestaHoras = 2 }: { respuestaHoras?: number }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 });

  const waGeneralHref = whatsappUrl(
    "Hola Troyani Inversiones, deseo hablar con un especialista para elegir la mejor solución para mi proyecto y solicitar una cotización.",
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dWaveElements = Array.from(root.querySelectorAll<SVGPathElement>("[data-wave]")).map(
      (el) => ({
        el,
        c: (el.dataset.wave || "16,1,0,70,0.6").split(",").map(Number),
      }),
    );

    if (reduced) {
      dWaveElements.forEach(({ el, c }) => {
        el.setAttribute("d", wavePath(0, c[0], c[1], c[2], c[3]));
      });
      return;
    }

    let rafId: number;
    const t0 = performance.now();

    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      dWaveElements.forEach(({ el, c }) => {
        el.setAttribute("d", wavePath(t * (c[4] || 0.6), c[0], c[1], c[2], c[3]));
      });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Cierre de contacto y cotización"
      className="relative overflow-hidden bg-[#0e1f2e] py-28 text-center text-white sm:py-36 md:py-40"
    >
      {/* Top wave inverted */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -top-px block h-[clamp(70px,10vw,140px)] w-full -scale-y-100"
      >
        <path data-wave="18,1.2,2,70,0.55" fill="rgba(23,105,194,0.35)" />
        <path data-wave="16,1,3.8,100,0.75" fill="rgba(143,192,240,0.3)" />
        <path data-wave="12,0.8,5,130,0.95" fill="#f4f6f7" />
      </svg>

      {/* Ambient radial dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000,transparent_80%)]"
      />

      <div className="container-site relative z-10 mx-auto flex max-w-[840px] flex-col items-center gap-5 sm:gap-6">
        {/* Headline */}
        <h2 className="font-sans text-[clamp(32px,4.8vw,64px)] font-bold leading-tight tracking-[-0.04em] text-white">
          ¿Listo para trabajar
          <span className="block text-[#4f9be8]">con nosotros?</span>
        </h2>

        <p className="max-w-[620px] font-sans text-[clamp(14.5px,1.2vw,17px)] leading-relaxed text-[#b9c9d8]">
          Habla directamente con un especialista. Te ayudamos a elegir la solución que mejor se
          adapta a tu proyecto y te enviamos una cotización personalizada hoy mismo.
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {/* Botón WhatsApp con efecto magnético */}
          <a
            href={waGeneralHref}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - r.left - r.width / 2) * 0.18;
              const y = (e.clientY - r.top - r.height / 2) * 0.3;
              setMagnetPos({ x, y });
            }}
            onMouseLeave={() => setMagnetPos({ x: 0, y: 0 })}
            style={{
              transform: `translate(${magnetPos.x}px, ${magnetPos.y}px)`,
            }}
            className="group inline-flex h-13 items-center gap-3 rounded-full bg-[#f5b82e] pl-5 pr-1.5 font-sans text-[14.5px] font-semibold text-[#0e1f2e] shadow-[0_18px_40px_-18px_rgba(245,184,46,0.7)] transition-all hover:bg-[#ffc640] sm:h-14 sm:pl-6 sm:text-[15px]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z"
                stroke="#0e1f2e"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9.2 9.3c.3 1.6 1.9 3.3 3.6 3.8l1-1 1.7.7-.4 1.5c-2.9.2-6.2-3-6-6l1.5-.4.7 1.7-1 1Z"
                fill="#0e1f2e"
              />
            </svg>
            Consultar por WhatsApp
            <span className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-[#0e1f2e] text-white transition-transform group-hover:translate-x-0.5">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8h11M9 3.5 13.5 8 9 12.5"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>

          {/* Botón Ver Productos */}
          <Link
            href="/catalogo/"
            className="inline-flex h-13 sm:h-14 items-center rounded-full border-[1.5px] border-white/25 px-6 sm:px-7 font-sans text-[14.5px] sm:text-[15px] font-medium text-white transition-colors hover:border-white hover:bg-white/[0.08]"
          >
            Ver nuestros productos
          </Link>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 block h-[clamp(60px,8vw,120px)] w-full"
      >
        <path data-wave="16,1,0.5,60,0.5" fill="rgba(23,105,194,0.3)" />
        <path data-wave="12,1.5,2.4,95,0.22" fill="rgba(79,155,232,0.22)" />
        <path data-wave="10,1.1,4,130,0.25" fill="rgba(0,140,200,0.25)" />
      </svg>
    </section>
  );
}
