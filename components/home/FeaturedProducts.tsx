"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatLitros } from "@/lib/format";
import type { Brand, Product } from "@/lib/schemas";
import { buildQuoteMessage, whatsappUrl } from "@/lib/whatsapp";

type FeaturedItem = {
  num: string;
  name: string;
  slug: string;
  img: string;
  meta: string;
  range: string;
  caps: string[];
};

type Props = {
  products: Product[];
  brands: Brand[];
  respuestaHoras?: number;
};

const CURATED_FEATURED: {
  slug: string;
  img: string;
  fallbackName: string;
  fallbackMeta: string;
  fallbackCaps: string[];
  fallbackRange: string;
}[] = [
  {
    slug: "tanques-para-agua",
    img: "/productos/dest-tanque-plus.png",
    fallbackName: "Tanques para Agua (Línea Plus+)",
    fallbackMeta: "Rotoplas · Hogar",
    fallbackCaps: ["700 L", "1,100 L", "1,500 L", "2,500 L"],
    fallbackRange: "700 L a 2,500 L",
  },
  {
    slug: "biodigestores",
    img: "/productos/dest-biodigestor.png",
    fallbackName: "Biodigestor Autolimpiable Rotoplas",
    fallbackMeta: "Rotoplas · Hogar",
    fallbackCaps: ["600 L", "800 L", "1,300 L", "3,000 L", "7,000 L"],
    fallbackRange: "600 L a 7,000 L",
  },
  {
    slug: "tanques-para-pisco-y-vino",
    img: "/productos/dest-tanque-pisco.png",
    fallbackName: "Tanques para Pisco y Vino",
    fallbackMeta: "Rotoplas · Agroindustria",
    fallbackCaps: ["250 L", "750 L", "1,100 L", "2,500 L", "5,000 L", "10,000 L", "15,000 L", "25,000 L"],
    fallbackRange: "250 L a 25,000 L",
  },
  {
    slug: "cisternas",
    img: "/productos/dest-cisterna.png",
    fallbackName: "Cisterna para Agua",
    fallbackMeta: "Rotoplas · Hogar",
    fallbackCaps: ["1,200 L", "2,000 L", "2,800 L", "5,000 L", "10,000 L"],
    fallbackRange: "1,200 L a 10,000 L",
  },
];

export default function FeaturedProducts({ products, brands }: Props) {
  const [selectedCaps, setSelectedCaps] = useState<number[]>([1, 0, 2, 0]);
  const [btnArrowHover, setBtnArrowHover] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const brandBySlug = new Map(brands.map((b) => [b.slug, b]));
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  const items: FeaturedItem[] = CURATED_FEATURED.map((c, i) => {
    const p = productBySlug.get(c.slug);
    const b = p ? brandBySlug.get(p.marca) : undefined;
    const brandLabel = b?.nombre ?? "Rotoplas";
    const lineLabel = p?.linea === "agroindustria" ? "Agroindustria" : "Hogar";

    let caps = c.fallbackCaps;
    let range = c.fallbackRange;

    if (p?.capacidades && p.capacidades.length > 0) {
      const distinctLitros = [
        ...new Set(p.capacidades.map((item) => item.capacidad_l)),
      ].sort((x, y) => x - y);
      if (distinctLitros.length > 0) {
        caps = distinctLitros.map((litros) => formatLitros(litros));
        range =
          distinctLitros.length === 1
            ? formatLitros(distinctLitros[0])
            : `${formatLitros(distinctLitros[0])} a ${formatLitros(
                distinctLitros[distinctLitros.length - 1],
              )}`;
      }
    }

    return {
      num: String(i + 1).padStart(2, "0"),
      name: p?.nombre ?? c.fallbackName,
      slug: c.slug,
      img: c.img,
      meta: `${brandLabel} · ${lineLabel}`,
      range,
      caps,
    };
  });

  const handlePickCap = (cardIdx: number, capIdx: number) => {
    setSelectedCaps((prev) => {
      const next = [...prev];
      next[cardIdx] = capIdx;
      return next;
    });

    const cardEl = rootRef.current?.querySelectorAll<HTMLElement>("[data-card]")[cardIdx];
    const imgEl = cardEl?.querySelector<HTMLElement>("[data-img]");
    if (imgEl) {
      imgEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], {
        duration: 450,
        easing: "cubic-bezier(.34,1.56,.64,1)",
      });
    }
  };

  return (
    <section
      ref={rootRef}
      aria-labelledby="destacados-heading"
      className="relative w-full overflow-hidden bg-white py-14 md:py-24"
    >
      <div className="container-site flex flex-col gap-8 md:gap-12">
        {/* Cabecera de la sección */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3 font-display text-xs tracking-[0.14em] text-[#3d5a73] uppercase">
              <span className="h-[2px] w-7 bg-[#1769c2]" aria-hidden="true" />
              <span>Los más cotizados del mes</span>
            </div>

            <h2
              id="destacados-heading"
              className="text-[clamp(32px,4vw,56px)] leading-[1.05] font-semibold tracking-[-0.035em] text-[#0e1f2e]"
            >
              Productos <span className="text-[#1769c2]">destacados.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="sm:hidden font-mono text-[11px] text-[#1769c2] font-medium tracking-wider">
              Desliza →
            </span>
            <Link
              href="/catalogo/"
              onMouseEnter={() => setBtnArrowHover(true)}
              onMouseLeave={() => setBtnArrowHover(false)}
              className="inline-flex h-12 items-center gap-3 rounded-full border-[1.5px] border-[#0e1f2e]/16 bg-white py-0 pr-1.5 pl-5 text-[15px] font-medium text-[#0e1f2e] transition-colors duration-200 hover:border-[#0e1f2e]"
            >
              <span>Ver los más cotizados</span>
              <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-[#0e1f2e] text-white">
                <span
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: btnArrowHover ? "translateX(3px)" : "none" }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
        </div>

        {/* Carrusel deslizable en móvil con snap y peek / Grilla 4 columnas en desktop */}
        <div
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 md:gap-6 no-scrollbar"
          style={{ perspective: 1400 }}
        >
          {items.map((p, i) => {
            const currentCapIdx = selectedCaps[i] ?? 0;
            const selectedCapLabel = p.caps[currentCapIdx] ?? p.caps[0] ?? "";
            const quoteUrl = whatsappUrl(
              buildQuoteMessage({
                producto: {
                  nombre: `${p.name} (${selectedCapLabel})`,
                  slug: p.slug,
                },
                precio: { modo: "cotizacion", cotizacion: true, vencido: false },
              }),
            );

            return (
              <FeaturedCard
                key={p.slug}
                item={p}
                index={i}
                selectedCap={selectedCapLabel}
                selectedCapIdx={currentCapIdx}
                quoteUrl={quoteUrl}
                onPickCap={(j) => handlePickCap(i, j)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  item,
  index,
  selectedCap,
  selectedCapIdx,
  quoteUrl,
  onPickCap,
}: {
  item: FeaturedItem;
  index: number;
  selectedCap: string;
  selectedCapIdx: number;
  quoteUrl: string;
  onPickCap: (j: number) => void;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [ctaArrowHover, setCtaArrowHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el || window.innerWidth < 640) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.transform = `translateY(-6px) rotateX(${((0.5 - y) * 5).toFixed(2)}deg) rotateY(${((x - 0.5) * 7).toFixed(2)}deg)`;

    if (imgRef.current) {
      imgRef.current.style.transform = `translate(${((x - 0.5) * 14).toFixed(1)}px, ${((y - 0.5) * 8 - 10).toFixed(1)}px) scale(1.05)`;
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth < 640) return;
    const el = cardRef.current;
    if (el) {
      el.style.transition = "transform .25s ease-out, box-shadow .5s";
      el.style.transform = "translateY(-6px)";
      el.style.boxShadow =
        "0 34px 60px -34px rgba(14,31,46,.5), 0 0 0 1.5px rgba(23,105,194,.3)";
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 640) return;
    const el = cardRef.current;
    if (el) {
      el.style.transition = "transform .7s cubic-bezier(.2,.8,.2,1), box-shadow .5s";
      el.style.transform = "";
      el.style.boxShadow = "0 0 0 1px rgba(14,31,46,.08)";
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "40%");
    }
    if (imgRef.current) {
      imgRef.current.style.transform = "";
    }
  };

  return (
    <article
      ref={cardRef}
      data-card={index}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex w-[280px] sm:w-auto shrink-0 snap-start sm:shrink flex-col overflow-hidden rounded-[24px] bg-white transition-[transform,box-shadow] duration-500 ease-out"
      style={{
        boxShadow: "0 0 0 1px rgba(14,31,46,.08)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Área superior con foto, gradiente radial, grilla técnica y badge Stock Lima */}
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden p-4"
        style={{
          background:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 40%), #e3eefa 0%, #f3f5f7 62%)",
        }}
      >
        {/* Grilla arquitectónica en el tercio inferior */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(14,31,46,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,31,46,.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "linear-gradient(transparent, #000)",
            maskImage: "linear-gradient(transparent, #000)",
          }}
        />

        {/* Número de serie de la card */}
        <span
          className="absolute top-3.5 left-4 font-display text-[11px] tracking-[0.08em] text-[#8a9aa8]"
          aria-hidden="true"
        >
          {item.num}
        </span>

        {/* Badge Stock Lima con punto pulsante */}
        <span className="absolute top-3 right-3 flex h-[26px] items-center gap-2 rounded-full bg-white/90 px-2.5 font-display text-[10.5px] tracking-[0.08em] text-[#1f7a4b] shadow-[0_0_0_1px_rgba(31,138,84,0.18)]">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#2fa36b] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#2fa36b]" />
          </span>
          STOCK LIMA
        </span>

        {/* Imagen del producto con img nativo */}
        <div className="relative size-[92%] max-h-[220px] flex items-center justify-center">
          <img
            ref={imgRef}
            data-img="1"
            src={item.img}
            alt={item.name}
            className="w-full h-full object-contain transition-transform duration-700 ease-out pointer-events-none"
            style={{
              filter: "drop-shadow(0 18px 18px rgba(14,31,46,.16))",
            }}
          />
        </div>
      </div>

      {/* Cuerpo inferior de la tarjeta */}
      <div className="flex flex-1 flex-col gap-3.5 border-t border-[#0e1f2e]/6 p-4 md:p-5">
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-[10.5px] tracking-[0.1em] text-[#5b7083] uppercase">
            {item.meta}
          </span>
          <h3 className="line-clamp-2 font-sans text-[16px] md:text-[17px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#0e1f2e] min-h-[2.6rem]">
            <Link
              href={`/productos/${item.slug}/`}
              className="hover:text-[#1769c2] transition-colors"
            >
              {item.name}
            </Link>
          </h3>
        </div>

        {/* Rango de capacidad y selector interactivo */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#5b7083]">
            Capacidad ·{" "}
            <span className="font-display font-medium text-[#1769c2]">
              {item.range}
            </span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {item.caps.map((cap, j) => {
              const isSelected = selectedCapIdx === j;
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() => onPickCap(j)}
                  className="h-7 cursor-pointer rounded-lg px-2.5 font-display text-[11.5px] font-medium transition-all duration-200"
                  style={{
                    background: isSelected ? "#0e1f2e" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#3d5a73",
                    border: isSelected
                      ? "1px solid #0e1f2e"
                      : "1px solid rgba(14,31,46,.14)",
                  }}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-[8px]" />

        {/* Botón de Cotización Amarillo con flecha animada */}
        <a
          href={quoteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setCtaArrowHover(true)}
          onMouseLeave={() => setCtaArrowHover(false)}
          className="group relative flex h-12 items-center justify-between gap-2.5 overflow-hidden rounded-[14px] bg-[#f5b82e] pr-1.5 pl-4.5 text-[14.5px] font-semibold text-[#0e1f2e] transition-colors duration-200 hover:bg-[#ffc640] shadow-sm"
        >
          <span className="flex min-w-0 items-baseline gap-2 truncate">
            <span>Cotizar</span>
            <span className="font-display text-xs font-medium opacity-75">
              {selectedCap}
            </span>
          </span>

          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#0e1f2e] text-white">
            <span
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: ctaArrowHover ? "translateX(3px)" : "none" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
        </a>
      </div>
    </article>
  );
}
