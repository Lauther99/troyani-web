"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { rangoLitros } from "@/lib/catalog";
import { formatLitros } from "@/lib/format";
import type { Category, Linea, Product } from "@/lib/schemas";

type Props = {
  categories: Category[];
  products: Product[];
};

const LINEA_INFO: Record<
  Linea,
  {
    badge: string;
    title: string;
    subtitle: string;
    countLabel: string;
  }
> = {
  hogar: {
    badge: "CATÁLOGO RESIDENCIAL",
    title: "Línea Hogar",
    subtitle: "Soluciones residenciales",
    countLabel: "06 LÍNEAS",
  },
  agroindustria: {
    badge: "CATÁLOGO AGRO E INDUSTRIAL",
    title: "Línea Agroindustria",
    subtitle: "Soluciones industriales y agro",
    countLabel: "06 LÍNEAS",
  },
};

function calcularCapacidadLabel(cat: Category, catProducts: Product[]): string {
  const rango = rangoLitros(catProducts);
  if (rango) {
    return rango.min === rango.max
      ? formatLitros(rango.min)
      : `${formatLitros(rango.min)} a ${formatLitros(rango.max)}`;
  }
  const medidas = [
    ...new Set(
      catProducts
        .map((p) => p.medida_nominal)
        .filter((m): m is string => Boolean(m)),
    ),
  ];
  if (medidas.length > 0) return medidas.join(" · ");
  if (cat.slug === "bombas") return "1/2 HP · 1 HP";
  if (cat.slug === "filtros-y-purificadores") return "3 modelos";
  if (cat.slug === "termas") return "3 modelos";
  if (cat.slug === "accesorios-banjo") return "Válvulas y conexiones";
  return cat.intro;
}

export default function CategoryCards({ categories, products }: Props) {
  const [btnArrowHover, setBtnArrowHover] = useState(false);
  const lineas: Linea[] = ["hogar", "agroindustria"];

  return (
    <section
      aria-labelledby="categorias-heading"
      className="container-site flex flex-col gap-10 pb-16 md:gap-14 md:pb-24"
    >
      {/* Cabecera general de la sección */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-3 font-display text-xs tracking-[0.14em] text-[#3d5a73] uppercase">
            <span className="h-[2px] w-7 bg-[#1769c2]" aria-hidden="true" />
            <span>Catálogo</span>
          </div>

          <h2
            id="categorias-heading"
            className="text-[clamp(32px,4vw,56px)] leading-[1.05] font-semibold tracking-[-0.035em] text-[#0e1f2e]"
          >
            Nuestros productos{" "}
            <span className="text-[#1769c2]">por línea.</span>
          </h2>
        </div>

        <Link
          href="/catalogo/"
          onMouseEnter={() => setBtnArrowHover(true)}
          onMouseLeave={() => setBtnArrowHover(false)}
          className="inline-flex h-12 items-center gap-3 rounded-full border-[1.5px] border-[#0e1f2e]/16 bg-white py-0 pr-1.5 pl-5 text-[15px] font-medium text-[#0e1f2e] transition-colors duration-200 hover:border-[#0e1f2e]"
        >
          <span>Ver todo el catálogo</span>
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

      {/* Bloques por Línea (Hogar y Agroindustria) */}
      {lineas.map((linea) => {
        const lineCategories = categories.filter((c) => c.linea === linea);
        if (lineCategories.length === 0) return null;
        const meta = LINEA_INFO[linea];

        return (
          <div key={linea} className="flex flex-col gap-5">
            {/* Subcabecera de la línea */}
            <div className="flex items-center justify-between gap-3 border-b border-[#0e1f2e]/10 pb-4">
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3.5">
                <h3 className="font-display text-[clamp(20px,1.8vw,24px)] font-semibold tracking-[-0.02em] text-[#0e1f2e]">
                  {meta.title}
                </h3>
                <span className="font-display text-xs tracking-[0.12em] text-[#5b7083] uppercase">
                  {meta.subtitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="sm:hidden font-mono text-[11px] text-[#1769c2] font-medium tracking-wider">
                  Desliza →
                </span>
                <span className="hidden sm:inline font-display text-xs tracking-[0.12em] text-[#5b7083]">
                  {meta.countLabel}
                </span>
              </div>
            </div>

            {/* Carrusel deslizable con peek en móvil / Grilla 6 columnas en desktop */}
            <div
              className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 md:gap-4.5 no-scrollbar"
              style={{ perspective: 1200 }}
            >
              {lineCategories.map((cat, idx) => {
                const catProducts = products.filter((p) => p.categoria === cat.slug);
                const capLabel = calcularCapacidadLabel(cat, catProducts);
                const numStr = String(idx + 1).padStart(2, "0");
                const imgSrc = cat.imagen || "/productos/prod-tanques.png";

                return (
                  <TiltCategoryCard
                    key={cat.slug}
                    index={numStr}
                    title={cat.nombre}
                    capLabel={capLabel}
                    href={`/catalogo/${cat.slug}/`}
                    imgSrc={imgSrc}
                    imgAlt={cat.h1}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function TiltCategoryCard({
  index,
  title,
  capLabel,
  href,
  imgSrc,
  imgAlt,
}: {
  index: string;
  title: string;
  capLabel: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
}) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const goRef = useRef<HTMLSpanElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el || window.innerWidth < 640) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.transform = `translateY(-6px) rotateX(${((0.5 - y) * 7).toFixed(2)}deg) rotateY(${((x - 0.5) * 9).toFixed(2)}deg)`;

    if (imgRef.current) {
      imgRef.current.style.transform = `translate(${((x - 0.5) * 10).toFixed(1)}px, ${((y - 0.5) * 8 - 4).toFixed(1)}px) scale(1.07)`;
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth < 640) return;
    setIsHovered(true);
    const el = cardRef.current;
    if (el) {
      el.style.transition = "transform .25s ease-out, box-shadow .5s";
      el.style.transform = "translateY(-6px)";
      el.style.boxShadow =
        "0 30px 50px -28px rgba(14,31,46,.45), 0 0 0 1.5px rgba(23,105,194,.35)";
    }
    if (goRef.current) {
      goRef.current.style.background = "#1769c2";
      goRef.current.style.borderColor = "#1769c2";
      goRef.current.style.color = "#ffffff";
      goRef.current.style.transform = "rotate(45deg)";
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 640) return;
    setIsHovered(false);
    const el = cardRef.current;
    if (el) {
      el.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1), box-shadow .5s";
      el.style.transform = "";
      el.style.boxShadow = "0 0 0 1px rgba(14,31,46,.07)";
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "30%");
    }
    if (imgRef.current) {
      imgRef.current.style.transform = "";
    }
    if (goRef.current) {
      goRef.current.style.background = "";
      goRef.current.style.borderColor = "rgba(14,31,46,.14)";
      goRef.current.style.color = "#0e1f2e";
      goRef.current.style.transform = "";
    }
  };

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex w-[190px] sm:w-auto shrink-0 snap-start sm:shrink flex-col overflow-hidden rounded-[22px] bg-white text-[#0e1f2e] transition-[transform,box-shadow] duration-500 ease-out"
      style={{
        boxShadow: "0 0 0 1px rgba(14,31,46,.07)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Área de la imagen con spotlight radial y watermark del número */}
      <div
        className="relative flex aspect-[4/3.4] items-center justify-center p-3"
        style={{
          background: isHovered
            ? "radial-gradient(circle at var(--mx, 50%) var(--my, 30%), rgba(23,105,194,.14), rgba(23,105,194,0) 65%)"
            : "radial-gradient(circle at 50% 30%, rgba(23,105,194,.06), rgba(23,105,194,0) 60%)",
        }}
      >
        <span
          className="absolute top-3 left-3.5 font-display text-[11px] tracking-[0.08em] text-[#8a9aa8]"
          aria-hidden="true"
        >
          {index}
        </span>

        <div className="relative size-full max-h-[140px] max-w-[160px] flex items-center justify-center">
          <img
            ref={imgRef}
            src={imgSrc}
            alt={imgAlt}
            className="w-full h-full object-contain transition-transform duration-500 ease-out pointer-events-none"
            style={
              imgSrc.includes("prod-filtros")
                ? {
                    WebkitMaskImage:
                      "radial-gradient(ellipse 72% 70% at 50% 50%, #000 55%, transparent 100%)",
                    maskImage:
                      "radial-gradient(ellipse 72% 70% at 50% 50%, #000 55%, transparent 100%)",
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* Pie de la tarjeta */}
      <div className="mt-auto flex flex-col gap-1.5 border-t border-[#0e1f2e]/6 p-3.5 pt-3 md:p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-sans text-[14px] md:text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#0e1f2e] line-clamp-2 min-h-[2.5rem]">
            {title}
          </span>
          <span
            ref={goRef}
            aria-hidden="true"
            className="flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full border border-[#0e1f2e]/14 text-[#0e1f2e] transition-all duration-300 ease-out mt-0.5"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 9 9 3M4 3h5v5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <span className="truncate font-display text-[11px] md:text-[11.5px] font-medium text-[#1769c2]">
          {capLabel}
        </span>
      </div>
    </Link>
  );
}
