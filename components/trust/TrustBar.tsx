"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Site } from "@/lib/schemas";

type Props = {
  items?: Site["datos_confianza"];
};

export default function TrustBar({ items: _items }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const countEls = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    const truck = root.querySelector<SVGElement>("[data-truck]");

    const count = (el: HTMLElement) => {
      const to = Number(el.dataset.count || 0);
      const dur = 1500;
      const start = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, Math.max(0, (now - start) / dur));
        const val = Math.round((1 - Math.pow(1 - k, 4)) * to);
        el.textContent = to >= 1000 ? val.toLocaleString("en-US") : String(val);
        if (k < 1) requestAnimationFrame(tick);
      };
      el.textContent = "0";
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);

          countEls.forEach((c) => count(c));

          if (truck) {
            truck.animate(
              [{ transform: "translateX(-26px)" }, { transform: "none" }],
              { duration: 1100, delay: 400, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" },
            );
          }
        });
      },
      { threshold: 0.15 },
    );

    io.observe(root);

    return () => io.disconnect();
  }, []);

  return (
    <section aria-label="Respaldo operativo" className="container-site p-8 md:pb-14">
      <div
        ref={rootRef}
        className="relative grid grid-cols-1 gap-[1px] overflow-hidden rounded-[24px] bg-[#0e1f2e]/7 shadow-[0_24px_60px_-36px_rgba(14,31,46,0.35),0_0_0_1px_rgba(14,31,46,0.06)] sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Línea superior con gradiente */}
        {/* <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#1769c2] to-transparent"
          aria-hidden="true"
        /> */}

        {/* Stat 0: Años de experiencia */}
        <div className="flex flex-col gap-3.5 bg-white p-6 md:p-8">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#eaf2fb]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="7.5" stroke="#1769c2" strokeWidth="1.6" />
              <path d="M10 6v4.2l2.8 1.8" stroke="#1769c2" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex items-baseline gap-2 font-display text-[32px] font-semibold leading-none tracking-[-0.035em] text-[#0e1f2e] md:text-[38px]">
            <span data-count="15">15</span>
            <span className="text-[0.5em] font-normal tracking-[-0.01em] text-[#0e1f2e]">años</span>
          </div>
          <span className="text-sm leading-relaxed text-[#45596b]">
            distribuyendo en Lima y sur
          </span>
        </div>

        {/* Stat 1: Almacén */}
        <div className="flex flex-col gap-3.5 bg-white p-6 md:p-8">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#eaf2fb]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M2.5 8 10 3.5 17.5 8v8.5h-15V8Z"
                stroke="#1769c2"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M6 16.5v-6h8v6M6 13h8" stroke="#1769c2" strokeWidth="1.6" />
            </svg>
          </span>
          <div className="flex items-baseline gap-2 font-display text-[32px] font-semibold leading-none tracking-[-0.035em] text-[#0e1f2e] md:text-[38px]">
            <span data-count="2400">2,400</span>
            <span className="text-[0.5em] font-normal tracking-[-0.01em] text-[#0e1f2e]">m² de almacén</span>
          </div>
          <span className="text-sm leading-relaxed text-[#45596b]">
            stock inmediato en Lima
          </span>
        </div>

        {/* Stat 2: Despacho / Regiones */}
        <div className="flex flex-col gap-3.5 bg-white p-6 md:p-8">
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-[#eaf2fb]">
            <svg data-truck="1" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M1.5 5h10v8.5h-10zM11.5 8h3.5l3 3v2.5h-6.5"
                stroke="#1769c2"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="5" cy="14.5" r="1.7" fill="#fff" stroke="#1769c2" strokeWidth="1.6" />
              <circle cx="14.5" cy="14.5" r="1.7" fill="#fff" stroke="#1769c2" strokeWidth="1.6" />
            </svg>
          </span>
          <div className="flex items-baseline gap-2 font-display text-[32px] font-semibold leading-none tracking-[-0.035em] text-[#0e1f2e] md:text-[38px]">
            <span data-count="18">18</span>
            <span className="text-[0.5em] font-normal tracking-[-0.01em] text-[#0e1f2e]">regiones</span>
          </div>
          <span className="text-sm leading-relaxed text-[#45596b]">
            Despacho con flota propia + transporte aliado
          </span>
        </div>

        {/* Stat 3: Distribuidor autorizado */}
        <div className="flex flex-col gap-3.5 bg-[#0e1f2e] p-6 text-white md:p-8">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#1769c2]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.5 10.3 8.2 14l7.3-8"
                stroke="#fff"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="font-display text-[22px] font-semibold leading-tight tracking-[-0.03em] md:text-[26px] text-[#fff]">
            Distribuidor autorizado Rotoplas
          </div>
          <Link
            href="/nosotros/"
            className="group mt-auto inline-flex items-center gap-2 text-sm leading-relaxed text-[#8fc0f0] transition-colors hover:text-white"
          >
            <span>Ver carta de distribución</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
