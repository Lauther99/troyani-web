"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Product } from "@/lib/schemas";

type Props = {
  products?: Product[];
  startDensity?: number;
};

const MIN = 1.0;
const MAX = 1.9;

type GradeDefinition = {
  num: string;
  name: string;
  short: string;
  lo: number;
  hi: number;
  app: string;
  density: string;
  material: string;
  good?: boolean;
  warn: string;
  cta: string;
  href: string;
  explanation: string;
};

const GRADES: GradeDefinition[] = [
  {
    num: "01",
    name: "Estándar",
    short: "1.00 – 1.20",
    lo: 1.0,
    hi: 1.2,
    app: "Agua potable (AB), riego y líquidos hasta 1.20 kg/l",
    density: "de 1.00 a 1.20 kg/l",
    material: "✓ Polietileno 100% virgen",
    good: true,
    warn: "Densidad máx. 1.20 kg/l",
    cta: "Ver tanques industriales",
    href: "/productos/tanques-industriales/",
    explanation:
      "Fabricado con polietileno de alta densidad 100% virgen en una sola pieza. Ideal para agua potable (con capa antibacterial AB), riego y compuestos cuya densidad se encuentre entre 1.00 y 1.20 kg/l.",
  },
  {
    num: "02",
    name: "Reforzado",
    short: "1.21 – 1.50",
    lo: 1.21,
    hi: 1.5,
    app: "Fertilizantes líquidos y sustancias químicas de densidad media",
    density: "de 1.21 a 1.50 kg/l",
    material: "Más de 300 sustancias químicas",
    warn: "Densidad 1.21 a 1.50 kg/l",
    cta: "Ver tanques reforzados",
    href: "/catalogo/?grado=reforzado",
    explanation:
      "Tanque industrial reforzado diseñado para almacenar compuestos químicos y fertilizantes con densidades de 1.21 a 1.50 kg/l sin generar olor, color ni sabor y sin oxidarse ni corroerse.",
  },
  {
    num: "03",
    name: "Doble reforzado",
    short: "1.51 – 1.90",
    lo: 1.51,
    hi: 1.9,
    app: "Ácidos, reactivos densos y sustancias químicas pesadas",
    density: "de 1.51 a 1.90 kg/l",
    material: "Alta resistencia química",
    warn: "Densidad 1.51 a 1.90 kg/l",
    cta: "Ver tanques doble reforzados",
    href: "/catalogo/?grado=extra",
    explanation:
      "Tanque industrial doble reforzado para el almacenamiento seguro de compuestos químicos pesados de alta densidad (de 1.51 a 1.90 kg/l), tales como ácidos densos, reactivos industriales y melazas.",
  },
];

const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;

export default function GradeComparison({ startDensity = 1.35 }: Props) {
  const [v, setV] = useState(startDensity);
  const [drag, setDrag] = useState(false);
  const [modalGrade, setModalGrade] = useState<GradeDefinition | null>(null);

  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const twRef = useRef<number>(0);
  const dragRef = useRef(false);

  dragRef.current = drag;

  const gradeOf = (val: number): number => {
    if (val <= 1.2) return 0;
    if (val <= 1.5) return 1;
    return 2;
  };

  const activeIndex = gradeOf(v);
  const activeGrade = GRADES[activeIndex];

  const tweenTo = (target: number, dur = 900) => {
    cancelAnimationFrame(twRef.current);
    const from = v;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 4);
      setV(Math.round((from + (target - from) * e) * 100) / 100);
      if (k < 1) twRef.current = requestAnimationFrame(step);
    };
    twRef.current = requestAnimationFrame(step);
  };

  const setFromX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const r = track.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setV(Math.round((MIN + k * (MAX - MIN)) * 100) / 100);
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragRef.current) setFromX(e.clientX);
    };
    const onUp = () => {
      if (dragRef.current) setDrag(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(twRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="comparador-grados"
      aria-labelledby="grados-heading"
      className="relative w-full overflow-hidden bg-[#f4f6f7] py-14 text-[#0e1f2e] md:py-24"
    >
      <div className="container-site flex flex-col gap-8 md:gap-11">
        {/* Encabezado */}
        <div className="flex flex-wrap items-end justify-between gap-6 md:gap-12">
          <div className="flex flex-1 flex-col gap-3.5 min-w-[300px]">
            <div className="flex items-center gap-3 font-display text-xs tracking-[0.14em] text-[#3d5a73] uppercase">
              <span className="h-[2px] w-7 bg-[#1769c2]" aria-hidden="true" />
              <span>Tanque de acuerdo a densidad de compuesto a almacenar</span>
            </div>

            <h2
              id="grados-heading"
              className="text-[clamp(32px,4vw,56px)] leading-[1.05] font-semibold tracking-[-0.035em] text-[#0e1f2e]"
            >
              Grados de tanques{" "}
              <span className="text-[#1769c2]">industriales.</span>
            </h2>
          </div>

          <p className="max-w-[420px] text-[15px] leading-relaxed text-[#45596b] text-pretty">
            Mueve el indicador hasta la densidad de tu químico y te mostramos el grado de tanque exacto que necesitas.
          </p>
        </div>

        {/* Banner interactivo oscuro con el slider de densidad */}
        <div className="relative flex flex-wrap items-center gap-6 rounded-[24px] bg-[#0e1f2e] p-6 text-white overflow-hidden shadow-card md:gap-10 md:p-9">
          {/* Resplandor radial de fondo */}
          <div
            className="pointer-events-none absolute -right-[10%] -top-[80%] h-[260%] w-[60%]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(23,105,194,.35), rgba(23,105,194,0))",
            }}
          />

          {/* Bloque numérico izquierdo */}
          <div className="relative flex min-w-[200px] flex-col gap-1.5">
            <span className="font-display text-[11px] tracking-[0.12em] text-[#8fc0f0] uppercase">
              Densidad de tu químico
            </span>
            <div className="flex items-baseline gap-2 font-display font-semibold leading-none tracking-[-0.04em]">
              <span className="text-[clamp(44px,5vw,64px)] tabular-nums">
                {v.toFixed(2)}
              </span>
              <span className="text-lg tracking-normal text-[#b9c9d8]">kg/l</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-[#d6e2ee]">
              <span>Recomendado</span>
              <span className="inline-flex h-[26px] items-center rounded-full bg-[#1769c2] px-3 font-display text-[13px] font-semibold text-white">
                {activeGrade.name}
              </span>
            </div>
          </div>

          {/* Slider interactivo derecho */}
          <div className="relative flex min-w-[280px] flex-1 flex-col gap-3.5 pt-2">
            <div
              ref={trackRef}
              onPointerDown={(e) => {
                cancelAnimationFrame(twRef.current);
                setDrag(true);
                setFromX(e.clientX);
              }}
              className="relative h-14 cursor-pointer touch-none select-none"
            >
              {/* Barra de 3 zonas */}
              <div className="absolute inset-x-0 top-[22px] flex h-3 gap-1">
                {GRADES.map((g, i) => {
                  const span = i === 0 ? g.hi - MIN : g.hi - GRADES[i - 1].hi;
                  const zLo = i === 0 ? MIN : GRADES[i - 1].hi;
                  const fill = Math.min(1, Math.max(0, (v - zLo) / span)) * 100;
                  const isZoneActive = i === activeIndex;

                  return (
                    <div
                      key={g.num}
                      style={{ flex: Math.round(span * 100) }}
                      className="relative h-full overflow-hidden rounded-full bg-white/12 transition-colors"
                    >
                      <div
                        style={{
                          width: `${fill.toFixed(2)}%`,
                          background: isZoneActive ? "#4f9be8" : "#1769c2",
                        }}
                        className="absolute inset-0 rounded-full transition-colors"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Cursor / Thumb arrastrable */}
              <div
                style={{ left: `${pct(v).toFixed(2)}%` }}
                className="pointer-events-none absolute top-0 h-14 w-0"
              >
                <div
                  style={{
                    transform: drag ? "scale(1)" : "scale(0.6)",
                  }}
                  className="absolute -left-7 top-0 size-14 rounded-full bg-[#1769c2]/28 transition-transform duration-300 ease-out"
                />
                <div className="absolute -left-3.5 top-3.5 size-7 rounded-full bg-white shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5),0_0_0_5px_#1769c2]" />
              </div>
            </div>

            {/* Etiquetas de las 3 zonas clicables / Pestañas en móvil */}
            <div className="flex gap-1.5 pt-1">
              {GRADES.map((g, i) => {
                const span = i === 0 ? g.hi - MIN : g.hi - GRADES[i - 1].hi;
                const isZoneActive = i === activeIndex;
                const centerVal =
                  Math.round(((g.lo + g.hi) / 2) * 100) / 100;

                return (
                  <button
                    key={g.num}
                    type="button"
                    onClick={() => tweenTo(centerVal, 700)}
                    style={{ flex: Math.round(span * 100) }}
                    className={`flex cursor-pointer flex-col items-start gap-0.5 text-left p-1.5 md:p-0 rounded-xl transition-all ${
                      isZoneActive
                        ? "bg-white/15 shadow-sm md:bg-transparent md:shadow-none"
                        : "hover:bg-white/5 md:hover:bg-transparent opacity-80"
                    }`}
                  >
                    <span
                      style={{ color: isZoneActive ? "#ffffff" : "#7f95a8" }}
                      className="truncate font-sans text-xs font-semibold md:text-[13px]"
                    >
                      {g.name}
                    </span>
                    <span
                      style={{ color: isZoneActive ? "#d6e2ee" : "#5b7083" }}
                      className="font-display text-[10px] md:text-[10.5px] tracking-[0.04em]"
                    >
                      {g.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Móvil: Ficha única dinámica del grado recomendado */}
        <div className="block lg:hidden">
          <article
            style={{
              backgroundColor: "#0e1f2e",
              color: "#ffffff",
              boxShadow: "0 24px 48px -20px rgba(14,31,46,0.6)",
            }}
            className="relative flex flex-col overflow-hidden rounded-[24px] transition-all duration-300"
          >
            {/* Cabecera */}
            <div className="flex flex-col gap-3.5 p-5 pb-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-[11px] tracking-[0.1em] uppercase text-[#8fa6ba]">
                  GRADO {activeGrade.num}
                </span>
                <span className="inline-flex h-6 items-center rounded-full bg-[#1769c2] px-2.5 font-display text-[10.5px] tracking-[0.08em] font-semibold text-white">
                  RECOMENDADO
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-sans text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#fff]">
                  {activeGrade.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalGrade(activeGrade)}
                  className="text-xs text-[#8fc0f0] underline underline-offset-4 hover:opacity-80"
                >
                  ¿Qué es?
                </button>
              </div>

              {/* Micro gauge bar */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="relative h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div
                    style={{
                      left: `${pct(activeIndex === 0 ? MIN : GRADES[activeIndex - 1].hi).toFixed(2)}%`,
                      width: `${(pct(activeGrade.hi) - pct(activeIndex === 0 ? MIN : GRADES[activeIndex - 1].hi)).toFixed(2)}%`,
                    }}
                    className="absolute top-0 bottom-0 rounded-full bg-[#4f9be8] transition-all duration-300"
                  />
                </div>
                <div className="flex justify-between font-display text-[10px] text-[#8fa6ba]">
                  <span>1.00</span>
                  <span>1.90 kg/l</span>
                </div>
              </div>
            </div>

            {/* Aplicación principal */}
            <div className="flex flex-col gap-1 border-t border-white/10 px-5 py-3.5">
              <span className="font-display text-[10px] tracking-[0.1em] uppercase text-[#8fa6ba]">
                Aplicación principal
              </span>
              <span className="text-sm leading-relaxed text-white">
                {activeGrade.app}
              </span>
            </div>

            {/* Densidad y Capacidades en 2 columnas compactas */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 px-5 py-3.5">
              <div className="flex flex-col gap-1">
                <span className="font-display text-[10px] tracking-[0.1em] uppercase text-[#8fa6ba]">
                  Densidad de compuesto
                </span>
                <span className="font-display text-sm md:text-base font-semibold text-[#8fc0f0]">
                  {activeGrade.density}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[10px] tracking-[0.1em] uppercase text-[#8fa6ba]">
                  Capacidades
                </span>
                <span className="font-display text-sm md:text-base font-semibold text-white">
                  5,000 L a 25,000 L
                </span>
              </div>
            </div>

            {/* Material y badges */}
            <div className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-3.5">
              <span className="inline-flex min-h-6 items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 font-display text-[10.5px] uppercase text-[#d6e2ee]">
                {activeGrade.material}
              </span>
              <span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-[rgba(255,156,156,0.3)] bg-[rgba(239,98,98,0.14)] px-2.5 py-0.5 font-display text-[10.5px] uppercase text-[#ff9c9c]">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1.5 11 10.5H1L6 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M6 5v2.4M6 8.8v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                {activeGrade.warn}
              </span>
            </div>

            {/* Botón CTA */}
            <div className="p-5 pt-2">
              <Link
                href={activeGrade.href}
                className="flex h-12 w-full items-center justify-between gap-2.5 rounded-xl bg-[#f5b82e] hover:bg-[#ffc640] px-4 text-sm font-semibold text-[#0e1f2e] transition-colors shadow-sm"
              >
                <span>{activeGrade.cta}</span>
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#0e1f2e] text-white">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </div>
          </article>
        </div>

        {/* Desktop: Grilla de las 3 tarjetas de grado lado a lado */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5.5">
          {GRADES.map((g, i) => {
            const on = i === activeIndex;
            const centerVal = Math.round(((g.lo + g.hi) / 2) * 100) / 100;
            const gaugeLeft = pct(i === 0 ? MIN : GRADES[i - 1].hi);
            const gaugeWidth = pct(g.hi) - gaugeLeft;

            return (
              <article
                key={g.num}
                onClick={() => tweenTo(centerVal, 700)}
                style={{
                  background: on ? "#0e1f2e" : "#ffffff",
                  color: on ? "#ffffff" : "#0e1f2e",
                  boxShadow: on
                    ? "0 40px 70px -40px rgba(14,31,46,0.7)"
                    : "0 0 0 1px rgba(14,31,46,0.08)",
                  transform: on ? "translateY(-8px)" : "none",
                }}
                className="relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] transition-[background,color,box-shadow,transform] duration-500 ease-out"
              >
                {/* Cabecera de la tarjeta */}
                <div className="flex flex-col gap-4 p-6 pb-5">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      style={{ color: on ? "#8fa6ba" : "#5b7083" }}
                      className="font-display text-[11px] tracking-[0.1em] uppercase"
                    >
                      GRADO {g.num}
                    </span>
                    <span
                      style={{
                        opacity: on ? 1 : 0,
                        transform: on ? "none" : "translateY(-6px)",
                      }}
                      className="inline-flex h-6 items-center rounded-full bg-[#1769c2] px-2.5 font-display text-[10.5px] tracking-[0.08em] font-semibold text-white transition-all duration-300"
                    >
                      RECOMENDADO
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-sans text-[clamp(24px,2.2vw,30px)] font-semibold leading-tight tracking-[-0.03em]">
                      {g.name}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalGrade(g);
                      }}
                      style={{ color: on ? "#8fc0f0" : "#1769c2" }}
                      className="text-[13px] underline underline-offset-4 hover:opacity-80"
                    >
                      ¿Qué es?
                    </button>
                  </div>

                  {/* Micro gauge bar */}
                  <div className="flex flex-col gap-2">
                    <div
                      style={{
                        background: on ? "rgba(255,255,255,0.12)" : "rgba(14,31,46,0.08)",
                      }}
                      className="relative h-1.5 overflow-hidden rounded-full"
                    >
                      <div
                        style={{
                          left: `${gaugeLeft.toFixed(2)}%`,
                          width: `${gaugeWidth.toFixed(2)}%`,
                        }}
                        className="absolute top-0 bottom-0 rounded-full bg-[#1769c2]"
                      />
                    </div>
                    <div
                      style={{ color: on ? "#8fa6ba" : "#5b7083" }}
                      className="flex justify-between font-display text-[10px]"
                    >
                      <span>1.00</span>
                      <span>1.90 kg/l</span>
                    </div>
                  </div>
                </div>

                {/* Aplicación principal */}
                <div
                  style={{
                    borderColor: on ? "rgba(255,255,255,0.1)" : "rgba(14,31,46,0.08)",
                  }}
                  className="flex flex-col gap-1.5 border-t px-6 py-4"
                >
                  <span
                    style={{ color: on ? "#8fa6ba" : "#5b7083" }}
                    className="font-display text-[10.5px] tracking-[0.1em] uppercase"
                  >
                    Aplicación principal
                  </span>
                  <span className="text-[15px] leading-relaxed text-pretty">
                    {g.app}
                  </span>
                </div>

                {/* Densidad del químico */}
                <div
                  style={{
                    borderColor: on ? "rgba(255,255,255,0.1)" : "rgba(14,31,46,0.08)",
                  }}
                  className="flex flex-col gap-1.5 border-t px-6 py-4"
                >
                  <span
                    style={{ color: on ? "#8fa6ba" : "#5b7083" }}
                    className="font-display text-[10.5px] tracking-[0.1em] uppercase"
                  >
                    Densidad del químico (kg/l)
                  </span>
                  <span
                    style={{ color: on ? "#8fc0f0" : "#1769c2" }}
                    className="font-display text-[clamp(20px,1.8vw,24px)] font-semibold tracking-[-0.02em]"
                  >
                    {g.density}
                  </span>
                </div>

                {/* Capacidades */}
                <div
                  style={{
                    borderColor: on ? "rgba(255,255,255,0.1)" : "rgba(14,31,46,0.08)",
                  }}
                  className="flex flex-col gap-1.5 border-t px-6 py-4"
                >
                  <span
                    style={{ color: on ? "#8fa6ba" : "#5b7083" }}
                    className="font-display text-[10.5px] tracking-[0.1em] uppercase"
                  >
                    Capacidades disponibles
                  </span>
                  <span className="font-display text-[clamp(20px,1.8vw,24px)] font-semibold tracking-[-0.02em]">
                    5,000 L a 25,000 L
                  </span>
                </div>

                {/* Material y badges */}
                <div
                  style={{
                    borderColor: on ? "rgba(255,255,255,0.1)" : "rgba(14,31,46,0.08)",
                  }}
                  className="flex flex-col gap-2.5 border-t px-6 py-4"
                >
                  <span
                    style={{ color: on ? "#8fa6ba" : "#5b7083" }}
                    className="font-display text-[10.5px] tracking-[0.1em] uppercase"
                  >
                    Material y rango
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span
                      style={{
                        background: g.good
                          ? on
                            ? "rgba(47,163,107,0.18)"
                            : "#e9f6ef"
                          : "transparent",
                        color: g.good
                          ? on
                            ? "#7fdcab"
                            : "#1f7a4b"
                          : on
                            ? "#d6e2ee"
                            : "#3d5a73",
                        borderColor: g.good
                          ? on
                            ? "rgba(127,220,171,0.35)"
                            : "rgba(31,138,84,0.25)"
                          : on
                            ? "rgba(255,255,255,0.25)"
                            : "rgba(14,31,46,0.22)",
                      }}
                      className="inline-flex min-h-7 items-center rounded-full border px-3 py-1 font-display text-[11px] tracking-[0.04em] uppercase"
                    >
                      {g.material}
                    </span>

                    <span
                      style={{
                        background: on ? "rgba(239,98,98,0.14)" : "#fdeeee",
                        color: on ? "#ff9c9c" : "#b93a3a",
                        borderColor: on
                          ? "rgba(255,156,156,0.3)"
                          : "rgba(185,58,58,0.22)",
                      }}
                      className="inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[11px] tracking-[0.04em] uppercase"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 1.5 11 10.5H1L6 1.5Z"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 5v2.4M6 8.8v.1"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                      {g.warn}
                    </span>
                  </div>
                </div>

                {/* Botón CTA */}
                <div className="mt-auto p-6 pt-2">
                  <Link
                    href={g.href}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: on ? "#f5b82e" : "transparent",
                      color: "#0e1f2e",
                      borderColor: on ? "#f5b82e" : "rgba(14,31,46,0.2)",
                    }}
                    className="group flex min-h-[50px] w-full items-center justify-between gap-2.5 rounded-[14px] border-[1.5px] pr-1.5 pl-4.5 text-[14.5px] font-semibold transition-all duration-300"
                  >
                    <span className="line-clamp-1">{g.cta}</span>
                    <span
                      style={{
                        background: on ? "#0e1f2e" : "#1769c2",
                        color: "#ffffff",
                      }}
                      className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
                    >
                      <span className="flex transition-transform duration-300 ease-out group-hover:translate-x-[3px]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 8h11M9 3.5 13.5 8 9 12.5"
                            stroke="#fff"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal explicativo: ¿Qué es? */}
      {modalGrade && (
        <dialog
          open
          aria-labelledby="dialog-title"
          onClick={() => setModalGrade(null)}
          className="fixed inset-0 z-50 m-auto flex w-[calc(100%-32px)] max-w-md flex-col rounded-card border border-border bg-white p-6 text-[#0e1f2e] shadow-overlay backdrop:bg-[var(--overlay-veil)]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xs font-semibold tracking-[0.08em] text-[#1769c2] uppercase">
                  Tipo de tanque según densidad
                </p>
                <h3 id="dialog-title" className="mt-1 text-xl font-bold">
                  {modalGrade.name} ({modalGrade.density})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalGrade(null)}
                aria-label="Cerrar explicación"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-tint-tech hover:text-primary cursor-pointer"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-text-muted">
              {modalGrade.explanation}
            </p>
            <div className="mt-2 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setModalGrade(null)}
                className="px-4 text-sm"
              >
                Entendido
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
