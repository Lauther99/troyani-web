"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  ArrowRight,
  Check,
  Headphones,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { Brand, Product } from "@/lib/schemas";
import { formatPEN } from "@/lib/format";
import { site } from "@/lib/site";

type Props = {
  product: Product;
  relatedProducts: Product[];
  brand?: Brand;
};

const IMG_MAP: Record<string, string> = {
  "/productos/tanque-plus-beige.webp": "/productos/dest-tanque-plus.png",
  "/productos/cisterna-agua.webp": "/productos/dest-cisterna.png",
  "/productos/biodigestor.webp": "/productos/dest-biodigestor.png",
  "/productos/bomba-centrifuga.webp": "/productos/prod-bombas.png",
  "/productos/purificador-sobre-tarja.webp": "/productos/prod-filtros.png",
  "/productos/terma-express.png": "/productos/prod-termas.png",
  "/productos/tanque-pisco-vino.webp": "/productos/dest-tanque-pisco.png",
  "/productos/tolva-industrial.webp": "/productos/cat-tolva.png",
};

function resolveImg(src?: string | null): string {
  if (!src) return "";
  return IMG_MAP[src] || src;
}

const TIPO_LABELS: Record<string, string> = {
  tecnica: "Vista técnica",
  uso: "En uso",
  detalle: "Detalle",
};

const LINEA_LABELS: Record<string, string> = {
  hogar: "Línea Hogar",
  agroindustria: "Línea Agroindustria",
};

const GRADO_LABELS: Record<string, string> = {
  estandar: "Grado Estándar",
  reforzado: "Grado Reforzado",
  doble_reforzado: "Doble reforzado",
  extra: "Doble reforzado",
};

const FORMA_LABELS: Record<string, string> = {
  cilindrica_vertical: "Cilíndrico vertical",
  cilindrica_horizontal: "Cilíndrico horizontal",
  conica: "Fondo cónico",
  rectangular: "Rectangular",
};

const SPEC_KEYS: [string, string, string?][] = [
  ["potencia", "Potencia"],
  ["temperatura_max_liquido", "Temp. máx. del líquido"],
  ["temperatura_ambiente_max_min", "Temp. ambiente máx./mín."],
  ["puestas_en_marcha_max_hora", "Arranques máx."],
  ["altura_max_aspiracion_m", "Altura máx. aspiración", " m"],
  ["altura_max_descarga_m", "Altura máx. descarga", " m"],
  ["presion_max_ejercicio_bar", "Presión máx.", " bar"],
  ["caudal_max_m3_h", "Caudal máx.", " m³/h"],
  ["tension_v", "Tensión"],
  ["corriente_max_a", "Corriente máx.", " A"],
  ["frecuencia_hz", "Frecuencia"],
  ["aislamiento", "Aislamiento"],
  ["grado_proteccion", "Protección"],
  ["conexion_succion", "Succión"],
  ["conexion_descarga", "Descarga"],
];

const fmtL = (n: number) => n.toLocaleString("en-US") + " L";
const m = (cm: number) => (cm / 100).toFixed(2) + " m";
const dec = (s: unknown) => String(s ?? "").replace(/&amp;/g, "&");

export default function ProductDetailClient({
  product: p,
  relatedProducts,
  brand,
}: Props) {
  const [vi, setVi] = useState(0); // variant index (color)
  const [ci, setCi] = useState(-1); // capacity index
  const [mi, setMi] = useState(0); // model index
  const [gi, setGi] = useState(0); // gallery index
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [glowCoords, setGlowCoords] = useState({ x: 50, y: 40 });
  const [vw, setVw] = useState(1200);

  const heroCtaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setVw(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // IntersectionObserver to reveal bottom floating bar when hero CTA leaves viewport
  useEffect(() => {
    const cta = heroCtaRef.current;
    if (!cta) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isPastCta =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShowFloatingBar(isPastCta);
      },
      { threshold: 0.1 },
    );

    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  // Data derivations
  const variants =
    Array.isArray(p.variantes) && p.variantes.length ? p.variantes : null;
  const safeVi = Math.min(vi, variants ? variants.length - 1 : 0);
  const currentVariant = variants ? variants[safeVi] : null;

  const caps = currentVariant
    ? currentVariant.capacidades
    : p.capacidades || [];
  let activeCi = ci;
  if (activeCi < 0 || activeCi >= caps.length) {
    activeCi = Math.max(
      0,
      caps.findIndex((c) => c.capacidad_l === p.capacidad_l),
    );
  }
  const currentCap = caps[activeCi] || null;

  const models = p.modelos || [];
  const safeMi = Math.min(mi, Math.max(0, models.length - 1));
  const currentModel = models[safeMi] || null;

  const horiz = p.dimensiones?.forma === "cilindrica_horizontal";
  const narrow = vw < 640;

  // Gallery derivations
  const gal = p.galeria || [];
  const safeGi = Math.min(gi, Math.max(0, gal.length - 1));
  const mainSrc =
    safeGi === 0 && currentVariant?.imagen
      ? currentVariant.imagen
      : gal[safeGi]?.src || p.imagen_principal;
  const mainAlt =
    safeGi === 0 && currentVariant
      ? `${p.nombre} · ${currentVariant.color}`
      : gal[safeGi]?.alt || p.nombre;
  const mainUrl = resolveImg(mainSrc);

  // Badges
  const badges: { label: string; bg: string; fg: string }[] = [];
  if (p.garantia) {
    badges.push({
      label: `Garantía ${currentVariant?.garantia || p.garantia}`,
      bg: "#e9f6ef",
      fg: "#1f7a4b",
    });
  }
  if (p.grado?.nivel) {
    badges.push({
      label: GRADO_LABELS[p.grado.nivel] || p.grado.nivel,
      bg: "#eaf2fb",
      fg: "#0f4f99",
    });
  }
  if (p.material) {
    badges.push({
      label: p.material,
      bg: "#ffffff",
      fg: "#3d5a73",
    });
  }

  // Summary Tiles
  const summary: { label: string; value: string }[] = [];
  if (currentCap) {
    summary.push({ label: "Capacidad", value: fmtL(currentCap.capacidad_l) });
    if (currentCap.altura_cm)
      summary.push({ label: "Altura", value: m(currentCap.altura_cm) });
    if (horiz && currentCap.largo_cm)
      summary.push({ label: "Largo", value: m(currentCap.largo_cm) });
    if (currentCap.diametro_cm)
      summary.push({ label: "Diámetro", value: m(currentCap.diametro_cm) });
    if (currentCap.peso_kg)
      summary.push({ label: "Peso vacío", value: `${currentCap.peso_kg} kg` });
  } else if (currentModel) {
    const e = currentModel.especificaciones as
      | Record<string, string | number>
      | undefined;
    if (currentModel.potencia_hp)
      summary.push({ label: "Potencia", value: currentModel.potencia_hp });
    if (e) {
      if (e.caudal_max_m3_h)
        summary.push({
          label: "Caudal máx.",
          value: `${e.caudal_max_m3_h} m³/h`,
        });
      if (e.altura_max_descarga_m)
        summary.push({
          label: "Descarga máx.",
          value: `${e.altura_max_descarga_m} m`,
        });
      if (e.presion_max_ejercicio_bar)
        summary.push({
          label: "Presión máx.",
          value: `${e.presion_max_ejercicio_bar} bar`,
        });
    }
    if (currentModel.modelo)
      summary.push({ label: "Modelo", value: currentModel.modelo });
  } else if (p.medida_nominal) {
    summary.push({ label: "Medidas", value: dec(p.medida_nominal) });
  }
  summary.push({
    label: "Garantía",
    value: String(
      currentCap?.garantia ||
        currentVariant?.garantia ||
        (p.garantia && String(p.garantia).length < 24
          ? p.garantia
          : p.garantia_anios
            ? `${p.garantia_anios} años`
            : "—"),
    ),
  });

  // Included items
  const includedItems =
    (currentCap && currentCap.accesorios_incluidos) ||
    (p.accesorios?.incluidos
      ? (p.accesorios_incluidos || []).map((a) =>
          a.nombre.replace(/\s*\(.*\)$/, ""),
        )
      : []);

  // Selection labels
  const selParts = [
    currentCap
      ? fmtL(currentCap.capacidad_l)
      : currentModel
        ? currentModel.nombre
        : "",
    currentVariant ? currentVariant.color : "",
  ].filter(Boolean);
  const selLabel = selParts.join(" · ") || dec(p.medida_nominal) || "";

  // WhatsApp Quote Link
  const quoteText = [
    `Hola Troyani, quiero cotizar:`,
    `· ${p.nombre}${selLabel ? ` (${selLabel})` : ""}`,
    `· SKU: ${p.sku}`,
    `https://troyani.com/productos/${p.slug}/`,
  ].join("\n");
  const quoteUrl = `https://wa.me/${site.whatsapp_e164}?text=${encodeURIComponent(quoteText)}`;

  // Size comparator
  let sizeComp: {
    capLabel: string;
    boxH: string;
    gap: string;
    padR: string;
    tankW: string;
    tankH: string;
    personH: string;
    radius: string;
    fill: string;
    stroke: string;
    hLabel: string;
    wLabel: string;
    formaLabel: string;
  } | null = null;

  if (
    currentCap &&
    currentCap.altura_cm &&
    (currentCap.diametro_cm || currentCap.largo_cm)
  ) {
    const wOf = (c: typeof currentCap) =>
      horiz ? c.largo_cm || c.diametro_cm || 0 : c.diametro_cm || 0;
    const maxH = Math.max(175, ...caps.map((c) => c.altura_cm || 0)) * 1.06;
    const maxW = Math.max(...caps.map(wOf));
    const boxH = narrow ? 210 : 260;
    const avail = narrow ? Math.max(120, vw - 32 - 40 - 28 - 76) : 300;
    const s = Math.min(boxH / maxH, avail / (maxW + (narrow ? 40 : 0)));
    const conic = p.dimensiones?.forma === "conica";
    const dark = currentVariant?.color === "Negro";

    sizeComp = {
      capLabel: fmtL(currentCap.capacidad_l),
      boxH: `${boxH + 20}px`,
      gap: narrow ? "20px" : "clamp(28px, 4vw, 48px)",
      padR: narrow ? "64px" : "40px",
      tankW: `${Math.round(wOf(currentCap) * s)}px`,
      tankH: `${Math.round(currentCap.altura_cm * s)}px`,
      personH: `${Math.round(170 * s)}px`,
      radius: horiz
        ? "999px"
        : conic
          ? "14px 14px 46% 46% / 14px 14px 24% 24%"
          : "16px 16px 8px 8px / 22px 22px 8px 8px",
      fill: dark
        ? "#262b31"
        : p.linea === "hogar" && p.tipo === "tanque"
          ? "#e6d9bb"
          : "#eef2f5",
      stroke: dark ? "#14181c" : "rgba(14,31,46,.18)",
      hLabel: m(currentCap.altura_cm),
      wLabel: (horiz ? "Largo " : "Ø ") + m(wOf(currentCap)),
      formaLabel: FORMA_LABELS[p.dimensiones?.forma || ""] || "",
    };
  }

  // Spec table derivation
  const specModels = models.filter((x) => x.especificaciones);
  let tableCols: string[] = [];
  let tableRows: { cells: string[]; isSelected?: boolean; index?: number }[] =
    [];

  if (caps.length) {
    const colDefs: [keyof (typeof caps)[0], string, (v: any) => string][] = [
      ["capacidad_l", "Capacidad", (v) => fmtL(Number(v))],
      ["altura_cm", "Altura", (v) => m(Number(v))],
      ["diametro_cm", "Diámetro", (v) => m(Number(v))],
      ["largo_cm", "Largo", (v) => m(Number(v))],
      ["peso_kg", "Peso", (v) => `${v} kg`],
      ["garantia", "Garantía", (v) => String(v)],
      ["tolerancia_cm", "Tolerancia", (v) => `${v} cm`],
    ];
    const activeColDefs = colDefs.filter(([k]) =>
      caps.some((c) => c[k] != null),
    );
    tableCols = activeColDefs.map((c) => c[1]);
    tableRows = caps.map((c, i) => ({
      cells: activeColDefs.map(([k, , f]) => (c[k] != null ? f(c[k]) : "—")),
      isSelected: i === activeCi,
      index: i,
    }));
  } else if (specModels.length) {
    const activeSpecs = SPEC_KEYS.filter(
      ([k]) =>
        k === "potencia" ||
        specModels.some((x) => (x.especificaciones as any)?.[k] != null),
    );
    tableCols = [
      "Especificación",
      ...specModels.map((x) => x.modelo || x.nombre),
    ];
    tableRows = activeSpecs.map(([k, label, unit]) => ({
      cells: [
        label,
        ...specModels.map((x) => {
          if (k === "potencia") return x.potencia_hp || "—";
          const val = (x.especificaciones as any)?.[k];
          return val != null ? `${val}${unit || ""}` : "—";
        }),
      ],
      isSelected: false,
    }));
  }

  const hasGrados =
    Array.isArray(p.grados_densidad) && p.grados_densidad.length > 0;
  const hasMedidas = tableCols.length > 0 || !!sizeComp || hasGrados;

  const modelCards =
    models.filter((x) => !x.especificaciones).length === models.length &&
    models.length
      ? models.map((x, i) => ({
          nombre: x.nombre,
          desc: dec(x.descripcion),
          hasDesc: !!x.descripcion,
          url: resolveImg(x.imagen),
          hasImg: !!resolveImg(x.imagen),
          isSelected: i === safeMi,
          index: i,
        }))
      : [];

  const accDetail = p.accesorios;
  const rawAccItems = accDetail?.items?.length
    ? accDetail.items
    : (p.accesorios_incluidos || []).map((a) => a.nombre);
  const showAcc = !!(accDetail || rawAccItems.length);

  const banjoItems = (p.items_accesorios || []).map((x, i) => {
    const med = dec(
      Array.isArray(x.medidas_comercializadas)
        ? x.medidas_comercializadas.join(", ")
        : x.medidas_comercializadas,
    );
    return {
      num: String(i + 1).padStart(2, "0"),
      nombre: dec(x.nombre),
      funcion: dec(x.funcion),
      medidas: med.length > 22 ? "Varias medidas" : med,
      rows: [
        ["Medidas", med],
        ["Material", x.material],
        ["Presión", x.presion_max],
        ["Detalle", x.especificaciones],
        ["Garantía", x.garantia],
      ].filter((r) => r[1]),
    };
  });

  const benefits = (p.beneficios || []).map((b, i) => {
    const t = dec(b);
    let title = t;
    let text = "";
    const colonIdx = t.indexOf(":");
    const dotIdx = t.indexOf(". ");
    if (colonIdx > 0 && colonIdx < 70) {
      title = t.slice(0, colonIdx);
      text = t.slice(colonIdx + 1).trim();
      text = text.charAt(0).toUpperCase() + text.slice(1);
    } else if (dotIdx > 0 && dotIdx < 60) {
      title = t.slice(0, dotIdx + 1);
      text = t.slice(dotIdx + 2);
    }
    return { num: String(i + 1).padStart(2, "0"), title, text };
  });

  // Section navigation links
  const navLinks: { label: string; href: string }[] = [
    { label: "Descripción", href: "#descripcion" },
    { label: "Beneficios", href: "#beneficios" },
  ];
  if (hasMedidas) {
    navLinks.push({
      label: caps.length ? "Medidas" : "Especificaciones",
      href: "#medidas",
    });
  }
  if (modelCards.length) navLinks.push({ label: "Modelos", href: "#modelos" });
  if (showAcc) navLinks.push({ label: "Accesorios", href: "#accesorios" });
  if (banjoItems.length) navLinks.push({ label: "Piezas", href: "#piezas" });
  navLinks.push({ label: "Relacionados", href: "#relacionados" });

  const stockLabel =
    p.disponibilidad?.estado === "stock"
      ? `STOCK ${String(p.disponibilidad.almacen || "").toUpperCase()}`
      : "A PEDIDO";

  const metaLine = `${p.marca === "banjo" ? "Banjo – USA" : "Rotoplas"} · ${LINEA_LABELS[p.linea] || ""}`;

  const priceNote = `Precio por cotización${
    p.precio?.incluye_igv ? " · Incluye IGV" : ""
  }${p.flete === "cotizar" ? " · Flete a cotizar según destino" : ""}`;

  const formatRelRange = (x: Product) =>
    x.capacidades?.length
      ? `${fmtL(Math.min(...x.capacidades.map((c) => c.capacidad_l)))} a ${fmtL(
          Math.max(...x.capacidades.map((c) => c.capacidad_l)),
        )}`
      : dec(x.medida_nominal || "");

  const handleGlow = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowCoords({ x, y });
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f6f7] text-[#0e1f2e] pb-24">
      {/* ── Breadcrumb ── */}
      <div className="container-site pt-6 md:pt-8 pb-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Catálogo", href: "/catalogo/" },
            { label: LINEA_LABELS[p.linea] || p.linea, href: `/catalogo/${p.categoria}/` },
            { label: p.nombre },
          ]}
        />
      </div>

      {/* ── Hero / Showcase Grid ── */}
      <section className="container-site py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Left: Gallery & Main Image */}
          <div className="flex flex-col gap-3.5 min-w-0">
            {/* Main Showcase Box */}
            <div
              onMouseMove={handleGlow}
              style={{
                background: `radial-gradient(circle at ${glowCoords.x}% ${glowCoords.y}%, #e3eefa 0%, #ffffff 64%)`,
              }}
              className="relative aspect-square rounded-[28px] shadow-[0_0_0_1px_rgba(14,31,46,0.07)] overflow-hidden transition-all duration-300"
            >
              {/* Subtle bottom grid overlay */}
              <div
                className="absolute inset-x-0 bottom-0 h-[36%] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(14,31,46,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,31,46,0.05) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  WebkitMaskImage: "linear-gradient(transparent, #000)",
                  maskImage: "linear-gradient(transparent, #000)",
                }}
              />

              {/* Main Image */}
              <div className="absolute inset-[8%] flex items-center justify-center pointer-events-none">
                {mainUrl ? (
                  <img
                    src={mainUrl}
                    alt={mainAlt}
                    className="w-full h-full object-contain drop-shadow-[0_24px_24px_rgba(14,31,46,0.16)] transition-transform duration-500 hover:scale-[1.03] pointer-events-auto"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl border-2 border-dashed border-[#0e1f2e]/20 flex flex-col items-center justify-center gap-2.5 p-6 text-center text-[#5b7083]">
                    <span className="font-mono text-xs uppercase tracking-wider">
                      {TIPO_LABELS[gal[safeGi]?.tipo] || "Vista"}
                    </span>
                    <span className="text-sm">{mainAlt}</span>
                  </div>
                )}
              </div>

              {/* Top Floating Badges */}
              <div className="absolute left-4 top-4 right-4 flex flex-wrap justify-between gap-2 pointer-events-none">
                <span className="flex items-center gap-2 h-7 px-3 rounded-full bg-white/95 shadow-[0_0_0_1px_rgba(31,138,84,0.18)] font-mono text-[10.5px] font-medium tracking-wider text-[#1f7a4b] whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2fa36b] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2fa36b]" />
                  </span>
                  {stockLabel}
                </span>

                {p.mas_popular && (
                  <span className="flex items-center h-7 px-3 rounded-full bg-[#0e1f2e] text-white font-mono text-[10.5px] font-medium tracking-wider whitespace-nowrap">
                    MÁS COTIZADO
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Carousel / Grid */}
            {gal.length > 1 && (
              <div className="grid grid-cols-5 gap-2.5">
                {gal.map((g, i) => {
                  const thumbUrl = resolveImg(g.src);
                  const isActive = i === safeGi;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setGi(i)}
                      aria-label={g.alt}
                      style={{ backgroundColor: "#ffffff" }}
                      className={`relative aspect-square w-full p-2 rounded-2xl cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 ${
                        isActive
                          ? "border-2 border-[#1769c2] shadow-sm"
                          : "border-2 border-[rgba(14,31,46,0.08)] opacity-85 hover:opacity-100"
                      }`}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={g.alt}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      ) : (
                        <span className="flex items-center justify-center bg-[#f3f5f7] font-mono text-[9px] uppercase tracking-wider text-[#5b7083] p-1 text-center w-full h-full rounded-lg">
                          {TIPO_LABELS[g.tipo] || "Foto"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Product Selector & Configuration (Sticky on desktop) */}
          <div className="lg:sticky lg:top-[calc(var(--header-h,64px)+1.5rem)] flex flex-col gap-5 min-w-0">
            {/* Header / Eyebrow / Title */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
                {metaLine}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-semibold text-[#0e1f2e] leading-[1.08] tracking-tight">
                {p.nombre}
              </h1>
              <p className="text-sm md:text-base text-[#45596b] leading-relaxed">
                {p.subtitulo}
              </p>
              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: b.bg, color: b.fg }}
                    className="inline-flex items-center h-7 px-3 rounded-full text-xs font-medium shadow-sm whitespace-nowrap"
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Selection Box Card */}
            <div
              style={{ backgroundColor: "#ffffff" }}
              className="flex flex-col gap-5 p-5 md:p-6 rounded-3xl shadow-[0_24px_60px_-40px_rgba(14,31,46,0.35),0_0_0_1px_rgba(14,31,46,0.06)]"
            >
              {/* Color Variants (if any) */}
              {variants && variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#5b7083]">
                    Color ·{" "}
                    <span className="text-[#0e1f2e] font-semibold">
                      {currentVariant?.color}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, i) => {
                      const isSelected = i === safeVi;
                      const swatchColor =
                        v.color === "Negro" ? "#1d2126" : "#e6d9bb";
                      return (
                        <button
                          key={v.color}
                          onClick={() => {
                            setVi(i);
                            setGi(0);
                          }}
                          style={{
                            backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
                            color: isSelected ? "#ffffff" : "#0e1f2e",
                            borderColor: isSelected
                              ? "#0e1f2e"
                              : "rgba(14,31,46,0.14)",
                          }}
                          className="inline-flex items-center gap-2.5 h-11 px-4 pl-2 rounded-full border-[1.5px] text-sm font-medium cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <span
                            style={{ backgroundColor: swatchColor }}
                            className="w-7 h-7 rounded-full shadow-[inset_0_0_0_1px_rgba(14,31,46,0.15)] shrink-0"
                          />
                          {v.color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Capacities Selector (if any) */}
              {caps.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#5b7083]">
                    Capacidad
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {caps.map((c, i) => {
                      const isSelected = i === activeCi;
                      return (
                        <button
                          key={c.capacidad_l}
                          onClick={() => setCi(i)}
                          style={{
                            backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
                            color: isSelected ? "#ffffff" : "#0e1f2e",
                            borderColor: isSelected
                              ? "#0e1f2e"
                              : "rgba(14,31,46,0.14)",
                          }}
                          className="h-10 px-3.5 rounded-xl border-[1.5px] font-mono text-xs md:text-sm cursor-pointer whitespace-nowrap transition-all hover:border-[#0e1f2e]"
                        >
                          {fmtL(c.capacidad_l)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Models Selector (if any) */}
              {models.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#5b7083]">
                    Modelo
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {models.map((mItem, i) => {
                      const isSelected = i === safeMi;
                      return (
                        <button
                          key={mItem.nombre}
                          onClick={() => setMi(i)}
                          style={{
                            backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
                            color: isSelected ? "#ffffff" : "#0e1f2e",
                            borderColor: isSelected
                              ? "#0e1f2e"
                              : "rgba(14,31,46,0.14)",
                          }}
                          className="min-h-10 px-3.5 py-1.5 rounded-xl border-[1.5px] text-xs md:text-sm font-medium cursor-pointer text-left transition-all"
                        >
                          {mItem.nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Specification Summary Tiles */}
              {summary.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1px] rounded-2xl overflow-hidden bg-[rgba(14,31,46,0.08)] shadow-[0_0_0_1px_rgba(14,31,46,0.08)]">
                  {summary.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1 p-3 bg-[#f8fafb]"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#5b7083]">
                        {s.label}
                      </span>
                      <span className="font-semibold text-sm md:text-base text-[#0e1f2e] leading-snug">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Included Accessories Tags */}
              {includedItems.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#45596b]">
                  <span className="font-semibold text-[#0e1f2e] mr-1">
                    Incluye:
                  </span>
                  {includedItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center min-h-[24px] px-2.5 py-1 rounded-md bg-[#e9f6ef] text-[#1f7a4b] font-medium leading-tight"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Primary Action Buttons (CTA) */}
              <div ref={heroCtaRef} className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href={quoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-[200px] flex items-center justify-between gap-3 h-14 px-5 pl-5 rounded-2xl bg-[#f5b82e] hover:bg-[#ffc640] text-[#0e1f2e] font-semibold text-base shadow-[0_16px_36px_-18px_rgba(245,184,46,0.8)] transition-all"
                >
                  <span className="truncate">
                    Cotizar {selParts[0] || "ahora"}
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-[#0e1f2e] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </span>
                </a>

                <a
                  href={quoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: "#ffffff" }}
                  className="flex items-center justify-center gap-2 h-14 px-5 rounded-2xl border-[1.5px] border-[rgba(14,31,46,0.16)] hover:border-[#0e1f2e] text-[#0e1f2e] font-medium text-sm whitespace-nowrap transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z"
                      stroke="#1f7a4b"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.2 9.3c.3 1.6 1.9 3.3 3.6 3.8l1-1 1.7.7-.4 1.5c-2.9.2-6.2-3-6-6l1.5-.4.7 1.7-1 1Z"
                      fill="#1f7a4b"
                    />
                  </svg>
                  WhatsApp
                </a>
              </div>

              <span className="text-xs text-[#5b7083] leading-relaxed">
                {priceNote}
              </span>
            </div>

            {/* Trust Mini-Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div
                style={{ backgroundColor: "#ffffff" }}
                className="flex flex-col gap-1.5 p-3 rounded-2xl shadow-[0_0_0_1px_rgba(14,31,46,0.06)]"
              >
                <ShieldCheck className="w-4 h-4 text-[#1769c2]" />
                <span className="text-xs font-medium leading-snug">
                  Distribuidor autorizado
                </span>
              </div>
              <div
                style={{ backgroundColor: "#ffffff" }}
                className="flex flex-col gap-1.5 p-3 rounded-2xl shadow-[0_0_0_1px_rgba(14,31,46,0.06)]"
              >
                <Truck className="w-4 h-4 text-[#1769c2]" />
                <span className="text-xs font-medium leading-snug">
                  Despacho a todo el Perú
                </span>
              </div>
              <div
                style={{ backgroundColor: "#ffffff" }}
                className="flex flex-col gap-1.5 p-3 rounded-2xl shadow-[0_0_0_1px_rgba(14,31,46,0.06)]"
              >
                <Headphones className="w-4 h-4 text-[#1769c2]" />
                <span className="text-xs font-medium leading-snug">
                  Asesoría técnica
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Section Sub-Navigation ── */}
      <nav className="sticky top-[var(--header-h,64px)] z-30 bg-[#f4f6f7]/90 backdrop-blur-md border-y border-[rgba(14,31,46,0.08)]">
        <div className="container-site flex gap-1 overflow-x-auto no-scrollbar py-1">
          {navLinks.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="shrink-0 flex items-center h-12 px-3.5 text-sm font-medium text-[#45596b] hover:text-[#0e1f2e] border-b-2 border-transparent hover:border-[#1769c2] transition-colors whitespace-nowrap"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Main Editorial & Specs Sections ── */}
      <div className="container-site flex flex-col">
        {/* SECTION: Descripción */}
        <section
          id="descripcion"
          className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 py-10 md:py-16 border-b border-[rgba(14,31,46,0.08)]"
        >
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
              <span className="w-7 h-0.5 bg-[#1769c2] shrink-0" />
              Descripción
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-[#0e1f2e] leading-snug tracking-tight">
              {p.resumen}
            </h2>
          </div>

          <div className="flex flex-col gap-4 text-base text-[#45596b] leading-relaxed">
            {(p.descripcion || []).map((desc, idx) => (
              <p key={idx}>{dec(desc)}</p>
            ))}

            {p.aplicaciones && p.aplicaciones.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#5b7083]">
                  Aplicaciones
                </span>
                <div className="flex flex-wrap gap-2">
                  {p.aplicaciones.map((app, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: "#ffffff" }}
                      className="inline-flex items-center h-8 px-3.5 rounded-full shadow-[0_0_0_1px_rgba(14,31,46,0.08)] text-xs font-medium text-[#0e1f2e]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: Beneficios */}
        <section
          id="beneficios"
          className="scroll-mt-24 flex flex-col gap-6 md:gap-8 py-10 md:py-16 border-b border-[rgba(14,31,46,0.08)]"
        >
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
            <span className="w-7 h-0.5 bg-[#1769c2] shrink-0" />
            Beneficios
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: "#ffffff" }}
                className="group flex flex-col gap-3.5 p-5 rounded-2xl shadow-[0_0_0_1px_rgba(14,31,46,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-30px_rgba(14,31,46,0.45),0_0_0_1px_rgba(23,105,194,0.25)]"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-[#eaf2fb] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#1769c2]" />
                  </span>
                  <span className="font-mono text-xs text-[#a3b1bd]">
                    {b.num}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-base text-[#0e1f2e] leading-snug">
                    {b.title}
                  </span>
                  {b.text && (
                    <span className="text-sm text-[#5b7083] leading-relaxed">
                      {b.text}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Medidas y Especificaciones */}
        {hasMedidas && (
          <section
            id="medidas"
            className="scroll-mt-24 flex flex-col gap-6 md:gap-8 py-10 md:py-16 border-b border-[rgba(14,31,46,0.08)]"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
                  <span className="w-7 h-0.5 bg-[#1769c2] shrink-0" />
                  {caps.length ? "Medidas" : "Especificaciones técnicas"}
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-[#0e1f2e] tracking-tight">
                  {caps.length
                    ? "Capacidades y dimensiones"
                    : "Compara los modelos"}
                </h2>
              </div>
              {caps.length > 0 && (
                <span className="text-xs md:text-sm text-[#5b7083]">
                  Toca una fila o tarjeta para seleccionar la capacidad
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left: Size Comparator (Tank vs Human) */}
              {sizeComp && (
                <div
                  style={{ backgroundColor: "#ffffff" }}
                  className="flex flex-col gap-3.5 p-5 md:p-6 rounded-3xl shadow-[0_0_0_1px_rgba(14,31,46,0.07)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-sm md:text-base">
                      Compara el tamaño
                    </span>
                    <span className="font-mono text-xs text-[#5b7083]">
                      {sizeComp.capLabel}
                    </span>
                  </div>

                  {/* Visual scale container */}
                  <div
                    style={{
                      height: sizeComp.boxH,
                      gap: sizeComp.gap,
                      paddingRight: sizeComp.padR,
                      backgroundImage:
                        "linear-gradient(rgba(14,31,46,0.05) 1px, transparent 1px)",
                      backgroundSize: "100% 28px",
                      backgroundPosition: "bottom",
                    }}
                    className="relative flex items-end justify-center border-b-[1.5px] border-[#0e1f2e]/20"
                  >
                    {/* Human silhouette */}
                    <div className="flex flex-col items-center">
                      <svg
                        viewBox="0 0 40 170"
                        style={{ height: sizeComp.personH }}
                        className="w-auto block transition-all duration-700 ease-out"
                      >
                        <circle cx="20" cy="13" r="11" fill="#c5d0da" />
                        <path
                          d="M8 32c0-4 3-7 7-7h10c4 0 7 3 7 7v48c0 2-1.5 3.5-3.5 3.5H28V166c0 2-1.8 4-4 4h-1.5c-1.4 0-2.5-1.1-2.5-2.5V108h0v59.5c0 1.4-1.1 2.5-2.5 2.5H16c-2.2 0-4-2-4-4V83.5h-.5C9.5 83.5 8 82 8 80V32Z"
                          fill="#c5d0da"
                        />
                      </svg>
                    </div>

                    {/* Scaled Tank silhouette */}
                    <div
                      style={{
                        position: "relative",
                        width: sizeComp.tankW,
                        height: sizeComp.tankH,
                        transition:
                          "width 0.7s cubic-bezier(.2,.8,.2,1), height 0.7s cubic-bezier(.2,.8,.2,1)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: sizeComp.radius,
                          backgroundColor: sizeComp.fill,
                          boxShadow:
                            "inset -14px 0 24px -12px rgba(14,31,46,.25), inset 10px 0 18px -10px rgba(255,255,255,.6), 0 0 0 1.5px " +
                            sizeComp.stroke,
                          backgroundImage:
                            "repeating-linear-gradient(180deg, transparent 0, transparent 14%, rgba(14,31,46,.08) 14%, rgba(14,31,46,.08) 15%)",
                          transition:
                            "border-radius 0.6s ease, background-color 0.5s ease",
                        }}
                      />
                      {/* Height guide line */}
                      <div className="absolute top-0 bottom-0 -right-5 w-2.5 border-y-[1.5px] border-[#1769c2] flex justify-center">
                        <span className="w-[1.5px] h-full bg-[#1769c2]" />
                      </div>
                      <span className="absolute top-1/2 left-[calc(100%+24px)] -translate-y-1/2 font-mono text-[11px] text-[#1769c2] whitespace-nowrap">
                        {sizeComp.hLabel}
                      </span>
                      <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 font-mono text-[11px] text-[#1769c2] whitespace-nowrap">
                        ↔ {sizeComp.wLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-3 pt-4 text-xs text-[#5b7083]">
                    <span>Persona de referencia: 1.70 m</span>
                    <span>{sizeComp.formaLabel}</span>
                  </div>
                </div>
              )}

              {/* Right: Spec Table (Desktop) & Cards (Mobile) */}
              <div className="flex flex-col gap-3 min-w-0">
                {/* Mobile Cards */}
                {caps.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:hidden">
                    {caps.map((c, i) => {
                      const isSel = i === activeCi;
                      return (
                        <button
                          key={c.capacidad_l}
                          onClick={() => setCi(i)}
                          style={{
                            backgroundColor: isSel ? "#0e1f2e" : "#ffffff",
                            color: isSel ? "#ffffff" : "#0e1f2e",
                            borderColor: isSel
                              ? "#0e1f2e"
                              : "rgba(14,31,46,0.1)",
                          }}
                          className="flex flex-col gap-2.5 p-4 rounded-2xl border-[1.5px] text-left cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-base">
                              {fmtL(c.capacidad_l)}
                            </span>
                            {isSel && (
                              <span className="font-mono text-[10px] tracking-wider bg-[#1769c2] text-white px-2 py-0.5 rounded-full">
                                SELECCIONADO
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {c.altura_cm && (
                              <div>
                                <span className="block opacity-65 font-mono text-[10px]">
                                  ALTURA
                                </span>
                                <span className="font-medium">
                                  {m(c.altura_cm)}
                                </span>
                              </div>
                            )}
                            {(c.diametro_cm || c.largo_cm) && (
                              <div>
                                <span className="block opacity-65 font-mono text-[10px]">
                                  {horiz ? "LARGO" : "DIÁM."}
                                </span>
                                <span className="font-medium">
                                  {m(
                                    horiz
                                      ? c.largo_cm || 0
                                      : c.diametro_cm || 0,
                                  )}
                                </span>
                              </div>
                            )}
                            {c.peso_kg && (
                              <div>
                                <span className="block opacity-65 font-mono text-[10px]">
                                  PESO
                                </span>
                                <span className="font-medium">
                                  {c.peso_kg} kg
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Desktop Spec Table */}
                {tableCols.length > 0 && (
                  <div
                    style={{ backgroundColor: "#ffffff" }}
                    className="hidden lg:block rounded-3xl shadow-[0_0_0_1px_rgba(14,31,46,0.07)] overflow-hidden"
                  >
                    <div className="overflow-x-auto max-h-[380px]">
                      <table className="w-full border-collapse text-sm">
                        <thead className="sticky top-0 z-10">
                          <tr>
                            {tableCols.map((col, i) => (
                              <th
                                key={i}
                                className="text-left py-3.5 px-4 font-mono text-[10.5px] font-medium tracking-wider uppercase text-[#5b7083] bg-[#f8fafb] border-b border-[rgba(14,31,46,0.08)] whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows.map((row, i) => {
                            const isSel = row.isSelected;
                            return (
                              <tr
                                key={i}
                                onClick={() => {
                                  if (row.index != null) setCi(row.index);
                                }}
                                style={{
                                  backgroundColor: isSel
                                    ? "#0e1f2e"
                                    : i % 2
                                      ? "#fbfcfd"
                                      : "#ffffff",
                                  color: isSel ? "#ffffff" : "#0e1f2e",
                                }}
                                className={`transition-colors ${
                                  row.index != null
                                    ? "cursor-pointer hover:bg-[#1769c2]/10"
                                    : "cursor-default"
                                }`}
                              >
                                {row.cells.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`py-3 px-4 border-b whitespace-nowrap tabular-nums ${
                                      isSel
                                        ? "border-[#0e1f2e] font-semibold text-white"
                                        : "border-[rgba(14,31,46,0.06)]"
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chemical Density Grade Box (if any) */}
            {hasGrados && (
              <div className="flex flex-col gap-3.5 p-5 md:p-6 rounded-3xl bg-[#0e1f2e] text-white mt-2">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <span className="font-semibold text-base">
                    Grado según densidad del químico
                  </span>
                  <Link
                    href="/soluciones-industriales/"
                    className="text-xs md:text-sm text-[#8fc0f0] hover:text-white transition-colors"
                  >
                    ¿Qué grado necesito? →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {p.grados_densidad!.map((g, i) => {
                    const widthPct = `${((i + 1) / p.grados_densidad!.length) * 100}%`;
                    return (
                      <div
                        key={g.tipo_tanque}
                        className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                      >
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            style={{ width: widthPct }}
                            className="h-full rounded-full bg-[#4f9be8]"
                          />
                        </div>
                        <span className="font-semibold text-sm">
                          {g.tipo_tanque}
                        </span>
                        <span className="font-mono text-xs text-[#b9c9d8]">
                          {g.densidad_kg_l} kg/l
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* SECTION: Modelos Disponibles */}
        {modelCards.length > 0 && (
          <section
            id="modelos"
            className="scroll-mt-24 flex flex-col gap-6 md:gap-8 py-10 md:py-16 border-b border-[rgba(14,31,46,0.08)]"
          >
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
              <span className="w-7 h-0.5 bg-[#1769c2] shrink-0" />
              Modelos disponibles
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {modelCards.map((mCard) => (
                <button
                  key={mCard.nombre}
                  onClick={() => setMi(mCard.index)}
                  style={{ backgroundColor: "#ffffff" }}
                  className={`flex flex-col p-0 rounded-3xl border-0 text-left overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                    mCard.isSelected
                      ? "shadow-[0_0_0_2px_#1769c2,0_24px_44px_-30px_rgba(23,105,194,0.6)]"
                      : "shadow-[0_0_0_1px_rgba(14,31,46,0.07)]"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full p-4 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#e3eefa,#f3f5f7_64%)]">
                    {mCard.hasImg ? (
                      <img
                        src={mCard.url}
                        alt={mCard.nombre}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#8a9aa8]">
                        Imagen del modelo
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 md:p-5">
                    <span className="font-semibold text-base text-[#0e1f2e]">
                      {mCard.nombre}
                    </span>
                    {mCard.hasDesc && (
                      <span className="text-xs md:text-sm text-[#5b7083] leading-relaxed">
                        {mCard.desc}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Accesorios */}
        {showAcc && (
          <section
            id="accesorios"
            className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-10 md:py-16 border-b border-[rgba(14,31,46,0.08)]"
          >
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
                <span className="w-7 h-0.5 bg-[#1769c2] shrink-0" />
                Accesorios
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-[#0e1f2e] tracking-tight">
                {accDetail?.incluidos
                  ? "Viene listo para instalar"
                  : "Accesorios recomendados"}
              </h2>

              <div
                style={{
                  backgroundColor: accDetail?.incluidos ? "#e9f6ef" : "#fff6e0",
                  color: accDetail?.incluidos ? "#1f6b43" : "#7a5200",
                }}
                className="flex gap-3 p-4 rounded-2xl text-sm leading-relaxed"
              >
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  {accDetail?.nota ||
                    "Incluye los accesorios listados a continuación."}
                </span>
              </div>

              {(p.accesorios_opcionales || []).includes("accesorios-banjo") && (
                <Link
                  href="/productos/accesorios-banjo/"
                  style={{ backgroundColor: "#ffffff" }}
                  className="self-start inline-flex items-center gap-2.5 h-12 px-5 rounded-full border-[1.5px] border-[rgba(14,31,46,0.16)] hover:border-[#0e1f2e] text-[#0e1f2e] text-sm font-medium transition-colors"
                >
                  Ver accesorios Banjo – USA
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            <div className="flex flex-col gap-3.5">
              <ol
                style={{ backgroundColor: "#ffffff" }}
                className="list-none m-0 p-0 flex flex-col rounded-3xl shadow-[0_0_0_1px_rgba(14,31,46,0.07)] overflow-hidden"
              >
                {rawAccItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3.5 p-4 md:px-5 border-b border-[rgba(14,31,46,0.06)] last:border-b-0"
                  >
                    <span
                      style={{
                        backgroundColor: accDetail?.incluidos
                          ? "#e9f6ef"
                          : "#eaf2fb",
                        color: accDetail?.incluidos ? "#1f7a4b" : "#1769c2",
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shrink-0"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm md:text-base font-medium text-[#0e1f2e]">
                      {dec(item).replace(/^\d+\.\s*/, "")}
                    </span>
                  </li>
                ))}
              </ol>

              {accDetail?.complementarios &&
                accDetail.complementarios.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#5b7083]">
                      Complementos recomendados
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {accDetail.complementarios.map((c, idx) => (
                        <span
                          key={idx}
                          style={{ backgroundColor: "#ffffff" }}
                          className="inline-flex items-center h-8 px-3.5 rounded-full shadow-[0_0_0_1px_rgba(14,31,46,0.08)] text-xs font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* SECTION: Piezas Banjo (if any) */}
        {banjoItems.length > 0 && (
          <section
            id="piezas"
            className="scroll-mt-24 flex flex-col gap-6 md:gap-8 py-10 md:py-16 border-b border-[rgba(14,31,46,0.08)]"
          >
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
              <span className="w-7 h-0.5 bg-[#1769c2] shrink-0" />
              Piezas de la línea
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {banjoItems.map((bj, idx) => (
                <article
                  key={idx}
                  style={{ backgroundColor: "#ffffff" }}
                  className="flex flex-col gap-3.5 p-5 rounded-3xl shadow-[0_0_0_1px_rgba(14,31,46,0.07)]"
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="font-mono text-xs text-[#a3b1bd]">
                      {bj.num}
                    </span>
                    <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-[#eaf2fb] text-[#0f4f99] font-mono text-[11px]">
                      {bj.medidas}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold text-base text-[#0e1f2e] leading-snug">
                      {bj.nombre}
                    </h3>
                    <p className="text-xs md:text-sm text-[#5b7083] leading-relaxed">
                      {bj.funcion}
                    </p>
                  </div>
                  <dl className="m-0 flex flex-col border-t border-[rgba(14,31,46,0.07)] pt-1">
                    {bj.rows.map(([k, v]) => (
                      <div
                        key={k}
                        className="grid grid-cols-[88px_minmax(0,1fr)] gap-2 py-2 border-b border-[rgba(14,31,46,0.06)] text-xs"
                      >
                        <dt className="font-mono uppercase tracking-wider text-[#5b7083]">
                          {k}
                        </dt>
                        <dd className="m-0 font-medium text-[#0e1f2e]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Restrictions callout (if any) */}
        {p.instalacion?.restricciones &&
          p.instalacion.restricciones.length > 0 && (
            <div className="flex gap-3 my-8 p-4 md:p-5 rounded-2xl bg-[#fff6e0] text-[#7a5200] text-sm leading-relaxed">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#b45309]" />
              <span>
                <strong>Importante:</strong>{" "}
                {p.instalacion.restricciones.join(" ")}
              </span>
            </div>
          )}

        {/* SECTION: Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <section
            id="relacionados"
            className="scroll-mt-24 flex flex-col gap-6 md:gap-8 py-10 md:py-16"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#3d5a73] font-medium">
                  <span className="w-7 h-0.5 bg-[#1769c2] shrink-0" />
                  {LINEA_LABELS[p.linea] || "Productos"}
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-[#0e1f2e] tracking-tight">
                  También te puede interesar
                </h2>
              </div>
              <Link
                href="/catalogo/"
                className="text-sm font-semibold text-[#1769c2] hover:text-[#0e1f2e] transition-colors"
              >
                Ver catálogo completo →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {relatedProducts.map((rel) => {
                const relImg = resolveImg(rel.imagen_principal);
                return (
                  <Link
                    key={rel.slug}
                    href={`/productos/${rel.slug}/`}
                    style={{ backgroundColor: "#ffffff" }}
                    className="group flex flex-col p-0 rounded-3xl shadow-[0_0_0_1px_rgba(14,31,46,0.07)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_56px_-32px_rgba(14,31,46,0.5),0_0_0_1.5px_rgba(23,105,194,0.3)]"
                  >
                    <div className="relative aspect-[1/0.8] w-full p-3.5 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#e3eefa_0%,#f3f5f7_62%)]">
                      {relImg ? (
                        <img
                          src={relImg}
                          alt={rel.nombre}
                          className="w-full h-full object-contain drop-shadow-[0_14px_14px_rgba(14,31,46,0.14)] transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                        />
                      ) : (
                        <span className="font-mono text-xs text-[#8a9aa8]">
                          Foto
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 md:p-5 border-t border-[rgba(14,31,46,0.06)]">
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#5b7083]">
                        {rel.marca === "banjo" ? "Banjo – USA" : "Rotoplas"}
                      </span>
                      <span className="font-semibold text-base text-[#0e1f2e] leading-snug line-clamp-2">
                        {rel.nombre}
                      </span>
                      <span className="font-mono text-xs text-[#1769c2] pt-1">
                        {formatRelRange(rel)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ── Bottom Floating Sticky Bar ── */}
      <div
        style={{
          transform: showFloatingBar ? "translateY(0)" : "translateY(130%)",
        }}
        className="fixed inset-x-0 bottom-0 z-40 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] pointer-events-none transition-transform duration-500 ease-out"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 p-2.5 pl-5 rounded-2xl bg-[#0e1f2e]/95 backdrop-blur-md text-white shadow-[0_24px_48px_-20px_rgba(14,31,46,0.6)] pointer-events-auto">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="font-semibold text-xs md:text-sm truncate">
              {p.nombre}
            </span>
            <span className="font-mono text-[11px] text-[#8fc0f0] truncate">
              {selLabel}
            </span>
          </div>

          <a
            href={quoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 flex items-center gap-2 h-11 px-4 rounded-xl bg-[#f5b82e] hover:bg-[#ffc640] text-[#0e1f2e] font-semibold text-sm transition-colors"
          >
            <span>Cotizar</span>
            <span className="w-6 h-6 rounded-lg bg-[#0e1f2e] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
