"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { whatsappUrl } from "@/lib/whatsapp";

const REASONS = [
  {
    num: "01",
    title: "11 años de experiencia",
    text: "En el mercado peruano desde 2015.",
    icon: (
      <path
        d="M10 2.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 7.8l5-.7L10 2.5Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    num: "02",
    title: "Distribuidor autorizado Rotoplas",
    text: "Productos originales con garantía de fábrica.",
    icon: (
      <path
        d="M10 2.5 3.5 5v4.8c0 3.9 2.8 7.1 6.5 7.7 3.7-.6 6.5-3.8 6.5-7.7V5L10 2.5ZM7 10l2 2 4-4"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    num: "03",
    title: "Abastecimiento seguro y puntual",
    text: "Stock disponible y entregas en los plazos acordados.",
    icon: (
      <path
        d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM10 6.5v3.8l2.6 1.6"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    num: "04",
    title: "Atención personalizada y asesoría técnica",
    text: "Te ayudamos a elegir capacidad, grado y accesorios.",
    icon: (
      <path
        d="M3.5 15.5c0-3 2.9-4.5 6.5-4.5s6.5 1.5 6.5 4.5M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    num: "05",
    title: "Productos certificados",
    text: "Soluciones eficientes y sostenibles, hechas para durar.",
    icon: (
      <path
        d="M10 2.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM7.8 7.6l1.6 1.6 2.9-3M7 12l-1.5 5.5L10 15.5l4.5 2L13 12"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const VALORES = [
  {
    num: "01",
    title: "Calidad",
    desc: "Cada producto cumple estándares internacionales. Rotoplas certifica lo que vendemos; nosotros garantizamos cómo lo entregamos.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M12 8.5 15.5 12 12 15.5 8.5 12 12 8.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Confianza",
    desc: "Más que productos, ofrecemos tranquilidad. Te acompañamos en cada etapa, desde la cotización hasta la entrega.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Experiencia",
    desc: "11 años resolviendo desafíos reales de almacenamiento nos permiten asesorarte con precisión y seguridad.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="5" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Cobertura",
    desc: "Atendemos todo el Perú con una logística eficiente. Llegamos donde lo necesitas, con el respaldo de un equipo comprometido.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3 19.8 7.5v9L12 21l-7.8-4.5v-9L12 3Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

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

export default function NosotrosClient() {
  const [activeReason, setActiveReason] = useState(0);
  const [yearCount, setYearCount] = useState(1990);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [coordsMision, setCoordsMision] = useState({ x: 30, y: 20 });
  const [coordsVision, setCoordsVision] = useState({ x: 70, y: 20 });
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 });

  const waAdviserHref = whatsappUrl(
    "Hola Troyani Inversiones, deseo hablar con un asesor técnico para elegir capacidad, grado y accesorios para mi proyecto.",
  );

  const waGeneralHref = whatsappUrl(
    "Hola Troyani Inversiones, estuve revisando su página Nosotros y me gustaría recibir información y asesoría para una cotización.",
  );

  // Animated year counter
  useEffect(() => {
    let raf: number;
    const start = performance.now() + 400;
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - start) / 1400));
      const val = Math.round(1990 + (1 - Math.pow(1 - k, 4)) * 25);
      setYearCount(val);
      if (k < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Wave paths animation loop
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
    <div
      ref={rootRef}
      className="w-full overflow-hidden bg-[#f4f6f7] font-sans text-[#0e1f2e] antialiased"
    >
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0e1f2e] pt-[108px] pb-32 text-white md:pt-[128px] md:pb-44">
        {/* Subtle grid background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_80%_at_25%_30%,#000,transparent_75%)]"
        />

        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[30%] -right-[12%] h-[140%] w-[70%] bg-[radial-gradient(closest-side,rgba(23,105,194,0.45),transparent)]"
        />

        {/* Mismo margin y grid estándar del home y catálogo (container-site) */}
        <div className="container-site relative z-10 flex flex-col gap-6 md:gap-8">
          {/* Breadcrumb unificado con tema oscuro */}
          <Breadcrumb
            dark
            items={[
              { label: "Inicio", href: "/" },
              { label: "Nosotros" },
            ]}
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-6 lg:flex-1">

              {/* H1 */}
              <h1 className="font-sans text-[clamp(36px,5.2vw,72px)] font-bold leading-[1.02] tracking-[-0.035em] text-white">
                El agua mueve
                <span className="block">hogares, industrias</span>
                <span className="block text-[#4f9be8]">y sueños.</span>
              </h1>

              {/* Párrafo intro */}
              <p className="max-w-[560px] font-sans text-[clamp(15px,1.25vw,17.5px)] leading-relaxed text-[#b9c9d8]">
                Somos una empresa peruana y distribuidor autorizado Rotoplas. Desde 2015 llevamos
                soluciones confiables de almacenamiento de agua y sustancias químicas a todo el país.
              </p>
            </div>

            {/* Glass Card: Desde 2015 */}
            <div className="flex w-fit shrink-0 flex-col gap-2 rounded-[22px] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-md sm:p-7 md:rounded-[24px] md:p-8">
              <span className="font-display text-[11px] tracking-[0.12em] uppercase text-[#8fc0f0]">
                Desde
              </span>
              <span className="font-sans text-[clamp(48px,5.5vw,76px)] font-bold leading-none tracking-[-0.05em] text-white tabular-nums">
                {yearCount}
              </span>
              <span className="flex items-center gap-2.5 whitespace-nowrap font-sans text-xs sm:text-[13px] text-[#d6e2ee]">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#4f9be8]" />
                  <span className="absolute inset-0 rounded-full bg-[#4f9be8]" />
                </span>
                Hecho en Perú, para todo el Perú
              </span>
            </div>
          </div>
        </div>

        {/* Ondas SVG inferiores animadas hacia #f4f6f7 */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 -bottom-px block h-[clamp(80px,11vw,160px)] w-full"
        >
          <path data-wave="18,1.3,0,70,0.6" fill="rgba(23,105,194,0.35)" />
          <path data-wave="16,1.1,1.8,100,0.8" fill="rgba(143,192,240,0.35)" />
          <path data-wave="12,0.9,3.1,130,1" fill="#f4f6f7" />
        </svg>
      </section>

      {/* ─── 2. QUIÉNES SOMOS ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-18 md:py-24">
        <div className="container-site grid grid-cols-1 items-start gap-10 md:gap-14 lg:grid-cols-2">
          {/* Columna Izquierda Sticky */}
          <div className="flex flex-col gap-3.5 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 font-display text-xs tracking-[0.14em] uppercase text-[#3d5a73]">
              <span className="h-0.5 w-7 shrink-0 bg-[#1769c2]" />
              ¿Quiénes somos?
            </div>
            <h2 className="font-sans text-[clamp(30px,3.8vw,52px)] font-bold leading-[1.05] tracking-[-0.035em] text-[#0e1f2e]">
              Un propósito claro
              <span className="block text-[#1769c2]">desde el primer día.</span>
            </h2>
          </div>

          {/* Columna Derecha: Párrafos editoriales */}
          <div className="flex flex-col gap-6 md:gap-7 text-justify">
            <p className="font-sans text-[clamp(17px,1.7vw,23px)] font-medium leading-[1.48] tracking-[-0.015em] text-[#0e1f2e]">
              Nacimos en 2015 con una meta: que cada hogar, industria y campo del Perú cuente con
              almacenamiento de agua y sustancias químicas en el que pueda confiar.
            </p>
            <p className="font-sans text-[clamp(17px,1.7vw,23px)] font-medium leading-[1.48] tracking-[-0.015em] text-[#0e1f2e]/85">
              Hoy somos distribuidores autorizados de Rotoplas y ofrecemos productos de polietileno
              de alta calidad para el hogar, la industria y el agro.
            </p>
            <p className="font-sans text-[clamp(17px,1.7vw,23px)] font-medium leading-[1.48] tracking-[-0.015em] text-[#0e1f2e]/70">
              Nuestro trabajo no termina en la venta. Te asesoramos para elegir el producto
              correcto, coordinamos una entrega segura y puntual, y te acompañamos en cada etapa.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="inline-flex h-9 items-center rounded-full bg-white px-4 font-sans text-[13px] font-semibold text-[#0e1f2e] shadow-[0_0_0_1px_rgba(14,31,46,0.08)]">
                Hogar
              </span>
              <span className="inline-flex h-9 items-center rounded-full bg-white px-4 font-sans text-[13px] font-semibold text-[#0e1f2e] shadow-[0_0_0_1px_rgba(14,31,46,0.08)]">
                Industria
              </span>
              <span className="inline-flex h-9 items-center rounded-full bg-white px-4 font-sans text-[13px] font-semibold text-[#0e1f2e] shadow-[0_0_0_1px_rgba(14,31,46,0.08)]">
                Agro
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. MISIÓN Y VISIÓN ───────────────────────────────────────── */}
      <section className="pb-14 sm:pb-18 md:pb-24">
        <div className="container-site grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {/* Tarjeta Misión */}
          <article
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setCoordsMision({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#0e1f2e] p-6 text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:p-8 md:min-h-[420px] md:rounded-[28px] md:p-9"
          >
            {/* Spotlight */}
            <div
              style={{
                background: `radial-gradient(420px circle at ${coordsMision.x}% ${coordsMision.y}%, rgba(79,155,232,0.18), transparent 60%)`,
              }}
              className="pointer-events-none absolute inset-0 transition-opacity"
            />

            {/* Ondas decorativas de agua en el fondo */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] opacity-70">
              <svg
                viewBox="0 0 1440 200"
                preserveAspectRatio="none"
                className="absolute inset-x-0 bottom-0 h-full w-full"
              >
                <path data-wave="14,1,0,40,0.6" fill="rgba(23,105,194,0.28)" />
                <path data-wave="10,1.4,2,70,0.8" fill="rgba(23,105,194,0.5)" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between gap-3">
              <span className="flex size-13 items-center justify-center rounded-[16px] border border-[#8fc0f0]/25 bg-[#4f9be8]/15 md:size-14">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8.5" stroke="#8fc0f0" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="4.5" stroke="#8fc0f0" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="1.3" fill="#8fc0f0" />
                </svg>
              </span>
              <span className="font-display text-[11px] tracking-[0.12em] uppercase text-[#8fc0f0]">
                Lo que hacemos
              </span>
            </div>

            <div className="relative z-10 mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
              <h3 className="font-sans text-[clamp(28px,3vw,42px)] font-bold leading-tight tracking-[-0.035em] text-white">
                Misión
              </h3>
              <p className="font-sans text-[clamp(15px,1.2vw,17.5px)] leading-relaxed text-[#d6e2ee]">
                Brindar soluciones confiables de almacenamiento de agua y sustancias químicas, con
                productos certificados de primera calidad, atención personalizada y un servicio
                seguro, eficiente y puntual en todo el Perú.
              </p>
            </div>
          </article>

          {/* Tarjeta Visión */}
          <article
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setCoordsVision({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#1769c2] p-6 text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:p-8 md:min-h-[420px] md:rounded-[28px] md:p-9"
          >
            {/* Spotlight */}
            <div
              style={{
                background: `radial-gradient(420px circle at ${coordsVision.x}% ${coordsVision.y}%, rgba(255,255,255,0.18), transparent 60%)`,
              }}
              className="pointer-events-none absolute inset-0 transition-opacity"
            />

            {/* Ondas decorativas de agua en el fondo */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] opacity-60">
              <svg
                viewBox="0 0 1440 200"
                preserveAspectRatio="none"
                className="absolute inset-x-0 bottom-0 h-full w-full"
              >
                <path data-wave="14,1,1,40,0.55" fill="rgba(255,255,255,0.12)" />
                <path data-wave="10,1.3,3,70,0.75" fill="rgba(14,31,46,0.22)" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between gap-3">
              <span className="flex size-13 items-center justify-center rounded-[16px] border border-white/25 bg-white/15 md:size-14">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                    stroke="#ffffff"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="#ffffff" strokeWidth="1.7" />
                </svg>
              </span>
              <span className="font-display text-[11px] tracking-[0.12em] uppercase text-[#e3eefa]">
                A dónde vamos
              </span>
            </div>

            <div className="relative z-10 mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
              <h3 className="font-sans text-[clamp(28px,3vw,42px)] font-bold leading-tight tracking-[-0.035em] text-white">
                Visión
              </h3>
              <p className="font-sans text-[clamp(15px,1.2vw,17.5px)] leading-relaxed text-[#f1f6fc]">
                Ser el distribuidor de referencia en almacenamiento industrial en el Perú, reconocido
                por la calidad de nuestros productos, la confiabilidad de nuestra logística y el
                impacto positivo que generamos en cada cliente.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ─── 4. POR QUÉ ELEGIRNOS ─────────────────────────────────────── */}
      <section className="bg-white py-14 sm:py-18 md:py-24">
        <div className="container-site grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Lista de 5 razones */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 font-display text-xs tracking-[0.14em] uppercase text-[#3d5a73]">
                <span className="h-0.5 w-7 shrink-0 bg-[#1769c2]" />
                ¿Por qué elegirnos?
              </div>
              <h2 className="font-sans text-[clamp(30px,3.8vw,52px)] font-bold leading-[1.05] tracking-[-0.035em] text-[#0e1f2e]">
                Cinco razones
                <span className="block text-[#1769c2]">para confiar en nosotros.</span>
              </h2>
            </div>

            <ol className="flex flex-col border-t border-[#0e1f2e]/10">
              {REASONS.map((r, i) => {
                const isActive = activeReason === i;
                return (
                  <li
                    key={r.num}
                    onMouseEnter={() => setActiveReason(i)}
                    className="group relative grid cursor-default grid-cols-[auto_1fr_auto] items-center gap-3.5 border-b border-[#0e1f2e]/10 py-4.5 transition-colors sm:gap-5"
                  >
                    {/* Barra azul inferior animada */}
                    <span
                      style={{ width: isActive ? "100%" : "0%" }}
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-[#1769c2] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    />

                    {/* Número */}
                    <span
                      style={{ color: isActive ? "#1769c2" : "#8a9aa8" }}
                      className="font-display text-xs font-semibold tracking-[0.08em] transition-colors"
                    >
                      {r.num}
                    </span>

                    {/* Texto */}
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-sans text-[clamp(15.5px,1.3vw,18px)] font-semibold leading-snug tracking-[-0.015em] text-[#0e1f2e]">
                        {r.title}
                      </span>
                      <span className="font-sans text-xs sm:text-[13.5px] leading-relaxed text-[#5b7083]">
                        {r.text}
                      </span>
                    </div>

                    {/* Icono con tilt y cambio de color */}
                    <span
                      style={{
                        backgroundColor: isActive ? "#1769c2" : "#eaf2fb",
                        transform: isActive ? "rotate(-8deg) scale(1.06)" : "none",
                      }}
                      className="flex size-9.5 shrink-0 items-center justify-center rounded-[12px] transition-all duration-400"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ stroke: isActive ? "#ffffff" : "#1769c2" }}
                      >
                        {r.icon}
                      </svg>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Tarjeta Fotográfica con Asesoría Técnica */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-[#e3eefa] shadow-lg md:rounded-[28px]">
            <Image
              src="/nosotros/nosotros-equipo.jpg"
              alt="Equipo de especialistas de Troyani Inversiones"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            />

            {/* Floating glass pill card at bottom */}
            <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-white/40 bg-white/90 p-3.5 shadow-[0_18px_40px_-20px_rgba(14,31,46,0.5)] backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4 sm:rounded-[18px]">
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-sm sm:text-[15px] font-semibold tracking-[-0.01em] text-[#0e1f2e]">
                  Asesoría técnica real
                </span>
                <span className="font-sans text-[11.5px] sm:text-xs text-[#5b7083]">
                  Te ayudamos a elegir capacidad, grado y accesorios
                </span>
              </div>
              <a
                href={waAdviserHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9.5 items-center rounded-xl bg-[#f5b82e] px-3.5 font-sans text-xs sm:text-[13px] font-semibold text-[#0e1f2e] whitespace-nowrap transition-colors hover:bg-[#ffc640]"
              >
                Hablar con un asesor →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. VALORES ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-18 md:py-24">
        <div className="container-site flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 font-display text-xs tracking-[0.14em] uppercase text-[#3d5a73]">
              <span className="h-0.5 w-7 shrink-0 bg-[#1769c2]" />
              Valores
            </div>
            <h2 className="font-sans text-[clamp(30px,3.8vw,52px)] font-bold leading-[1.05] tracking-[-0.035em] text-[#0e1f2e]">
              Lo que nos mueve
              <span className="block text-[#1769c2]">en cada entrega.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map((v) => (
              <article
                key={v.num}
                className="group relative flex min-h-[290px] flex-col justify-between overflow-hidden rounded-[22px] bg-white p-6 shadow-[0_0_0_1px_rgba(14,31,46,0.07)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_56px_-32px_rgba(14,31,46,0.45),0_0_0_1.5px_rgba(23,105,194,0.3)] md:rounded-[24px] md:p-7"
              >
                {/* Wave fill rising on hover */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full translate-y-[78%] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-y-[8%]">
                  <svg
                    viewBox="0 0 1440 200"
                    preserveAspectRatio="none"
                    className="absolute -top-[38px] left-0 h-10 w-full"
                  >
                    <path data-wave="22,1.2,0,90,0.9" fill="#eaf2fb" />
                  </svg>
                  <div className="absolute inset-0 bg-[#eaf2fb]" />
                </div>

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-[14px] bg-[#eaf2fb] text-[#1769c2] transition-all duration-400 group-hover:scale-105 group-hover:bg-[#1769c2] group-hover:text-white md:size-12">
                    {v.icon}
                  </span>
                  <span className="font-display text-[11px] tracking-[0.12em] text-[#8a9aa8]">
                    {v.num}
                  </span>
                </div>

                <div className="relative z-10 mt-auto flex flex-col gap-2">
                  <h3 className="font-sans text-[clamp(19px,1.6vw,22px)] font-bold tracking-[-0.025em] text-[#0e1f2e]">
                    {v.title}
                  </h3>
                  <p className="font-sans text-[13.5px] sm:text-[14px] leading-relaxed text-[#45596b]">
                    {v.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. CIERRE Y CTA FINAL ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0e1f2e] py-28 text-center text-white sm:py-36 md:py-40">
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
    </div>
  );
}
