"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  capacidadesProducto,
  GRADO_LABELS,
  RANGOS_CAPACIDAD,
  resolveRangoCapacidad,
} from "@/lib/catalog";
import { formatLitros } from "@/lib/format";
import { precioEfectivo } from "@/lib/products";
import type { Brand, Product } from "@/lib/schemas";
import { buildQuoteMessage, whatsappUrl } from "@/lib/whatsapp";

type Props = {
  product: Product;
  brand?: Brand;
  activeRangoId?: string | null;
  activeRangoIds?: string[];
  variant?: "vertical" | "horizontal";
  respuestaHoras?: number;
};

const PRODUCT_IMAGE_OVERRIDE: Record<string, string> = {
  "tanques-para-agua": "/productos/dest-tanque-plus.png",
  cisternas: "/productos/dest-cisterna.png",
  biodigestores: "/productos/dest-biodigestor.png",
  bombas: "/productos/prod-bombas.png",
  "filtros-y-purificadores": "/productos/prod-filtros.png",
  termas: "/productos/prod-termas.png",
  "tanques-industriales": "/productos/tanque-industrial-ab.webp",
  "nodriza-industrial": "/productos/nodriza-industrial.webp",
  tolvas: "/productos/cat-tolva.png",
  "cisterna-industrial": "/productos/cisterna-industrial.webp",
  "tanques-para-pisco-y-vino": "/productos/dest-tanque-pisco.png",
  "accesorios-banjo": "/productos/banjo-valvula-full-port.webp",
};

export default function ProductCard({
  product,
  brand,
  activeRangoId,
  activeRangoIds,
  variant = "vertical",
}: Props) {
  const [coords, setCoords] = useState({ x: 50, y: 40 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 50, y: 40 });
  };

  const fotoSrc =
    PRODUCT_IMAGE_OVERRIDE[product.slug] ||
    product.galeria.find((f) => f.tipo === "tecnica")?.src ||
    product.galeria[0]?.src ||
    "/productos/tanque-plus-beige.webp";

  const precio = precioEfectivo(product);
  const brandLabel = brand?.nombre ?? product.marca;
  const href = `/productos/${product.slug}/`;

  const quoteHref = whatsappUrl(
    buildQuoteMessage({
      producto: { nombre: product.nombre, slug: product.slug },
      precio,
    }),
  );

  const caps = capacidadesProducto(product);
  const activeIds =
    activeRangoIds && activeRangoIds.length > 0
      ? activeRangoIds
      : activeRangoId
        ? [activeRangoId]
        : [];
  const activeRangos = activeIds
    .map((id) => resolveRangoCapacidad(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  // Determinar grado visible
  let gradeBadge: string | null = null;
  if (product.grado?.nivel) {
    gradeBadge = GRADO_LABELS[product.grado.nivel].toUpperCase();
  } else if (product.grados_densidad && product.grados_densidad.length > 0) {
    gradeBadge = "3 GRADOS";
  }

  // Range label
  let rangeLabel = "";
  if (caps.length > 1) {
    rangeLabel = `${formatLitros(caps[0])} a ${formatLitros(caps[caps.length - 1])}`;
  } else if (caps.length === 1) {
    rangeLabel = formatLitros(caps[0]);
  } else if (product.medida_nominal) {
    rangeLabel = product.medida_nominal;
  }

  if (variant === "horizontal") {
    return (
      <article className="group relative flex gap-4 rounded-[22px] border border-[#0e1f2e]/8 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-[#f4f6f7]">
          <Image
            src={fotoSrc}
            alt={product.nombre}
            fill
            sizes="112px"
            className="object-contain p-2"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <span className="font-display text-[10.5px] tracking-[0.1em] text-[#5b7083] uppercase">
              {brandLabel} · {product.linea}
            </span>
            <h3 className="line-clamp-1 font-sans text-base font-semibold text-[#0e1f2e]">
              <Link href={href} className="hover:text-[#1769c2]">
                {product.nombre}
              </Link>
            </h3>
            {rangeLabel && (
              <p className="font-display text-xs text-[#1769c2]">{rangeLabel}</p>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-display text-[10.5px] text-[#1f7a4b]">
              <span className="size-2 rounded-full bg-[#2fa36b]" />
              STOCK LIMA
            </span>
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-xl bg-[#f5b82e] px-4 font-sans text-xs font-semibold text-[#0e1f2e] transition-colors hover:bg-[#ffc640]"
            >
              Cotizar
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#0e1f2e]/8 bg-white transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_56px_-32px_rgba(14,31,46,0.5),0_0_0_1.5px_rgba(23,105,194,0.3)]"
    >
      {/* Contenedor de Imagen con Spotlight Radial */}
      <div
        style={{
          background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, #e3eefa 0%, #f3f5f7 62%)`,
        }}
        className="relative flex aspect-[1/0.92] items-center justify-center overflow-hidden transition-colors"
      >
        {/* Badge STOCK LIMA */}
        <span className="absolute top-3 left-3 z-10 flex h-[26px] items-center gap-1.5 rounded-full bg-white/90 px-2.5 font-display text-[10.5px] tracking-[0.08em] text-[#1f7a4b] shadow-[0_0_0_1px_rgba(31,138,84,0.18)] whitespace-nowrap">
          <span className="relative size-[7px] shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#2fa36b]" />
            <span className="absolute inset-0 rounded-full bg-[#2fa36b]" />
          </span>
          STOCK LIMA
        </span>

        {/* Badge Grado */}
        {gradeBadge && (
          <span className="absolute top-3 right-3 z-10 flex h-[26px] items-center rounded-full bg-[#0e1f2e] px-2.5 font-display text-[10.5px] tracking-[0.06em] text-white uppercase whitespace-nowrap">
            {gradeBadge}
          </span>
        )}

        {/* Imagen del producto con Parallax / Tilt sutil y Drop Shadow */}
        <Link
          href={href}
          className="relative flex size-[88%] items-center justify-center"
        >
          <div
            style={{
              transform: isHovered
                ? `translate(${((coords.x - 50) * 0.22).toFixed(1)}px, ${((coords.y - 50) * 0.15 - 6).toFixed(1)}px) scale(1.04)`
                : "none",
            }}
            className="relative size-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] drop-shadow-[0_16px_16px_rgba(14,31,46,0.14)]"
          >
            <Image
              src={fotoSrc}
              alt={product.nombre}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Contenido / Info de la card */}
      <div className="flex flex-1 flex-col gap-3 border-t border-[#0e1f2e]/6 p-4">
        {/* Meta y Título */}
        <div className="flex flex-col gap-1">
          <span className="font-display text-[10.5px] tracking-[0.1em] text-[#5b7083] uppercase">
            {brandLabel} · {product.linea === "agroindustria" ? "AGROINDUSTRIA" : "HOGAR"}
          </span>
          <h3 className="line-clamp-2 font-sans text-base font-semibold leading-[1.3] tracking-[-0.015em] text-[#0e1f2e]">
            <Link href={href} className="transition-colors hover:text-[#1769c2]">
              {product.nombre}
            </Link>
          </h3>
        </div>

        {/* Chips de Capacidades */}
        {caps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {caps.map((c) => {
              const matchesFilter =
                activeRangos.length > 0 &&
                activeRangos.some(
                  (rg) => c >= rg.min && (rg.max === null || c <= rg.max),
                );

              return (
                <span
                  key={c}
                  style={{
                    background: matchesFilter ? "#1769c2" : "#f1f4f6",
                    color: matchesFilter ? "#ffffff" : "#3d5a73",
                  }}
                  className="inline-flex h-6 items-center rounded-[7px] px-2 font-display text-[11px] whitespace-nowrap transition-colors"
                >
                  {formatLitros(c)}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex-1" />

        {/* Footer: Rango de litros y Botón CTA Cotizar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <span className="font-display text-[11.5px] font-medium text-[#1769c2] whitespace-nowrap">
            {rangeLabel}
          </span>

          <a
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/cta relative z-10 flex h-[42px] shrink-0 items-center gap-2.5 rounded-xl bg-[#f5b82e] pl-4 pr-1.5 font-sans text-sm font-semibold text-[#0e1f2e] transition-colors hover:bg-[#ffc640]"
          >
            Cotizar
            <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-[#0e1f2e] text-white">
              <svg
                className="size-3.5 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8h11M9 3.5 13.5 8 9 12.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
