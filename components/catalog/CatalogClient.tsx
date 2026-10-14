"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import EmptyState from "@/components/catalog/EmptyState";
import FilterBar from "@/components/catalog/FilterBar";
import LineTabs from "@/components/catalog/LineTabs";
import ProductGrid from "@/components/catalog/ProductGrid";
import ResultCount from "@/components/catalog/ResultCount";
import Button from "@/components/ui/Button";
import {
  type CatalogFilters,
  filterProducts,
  type OrdenCatalogo,
  resolveRangoCapacidad,
} from "@/lib/catalog";
import type { Brand, Grado, Linea, Product, Uso } from "@/lib/schemas";

type Props = {
  products: Product[];
  brands: Brand[];
  respuestaHoras?: number;
  initialLinea?: Linea | null;
  categorySlug?: string | null;
  title: string;
  subtitle: string;
};

const VALID_LINEAS = new Set<Linea>(["hogar", "agroindustria"]);
const VALID_USOS = new Set<Uso>(["agua", "quimicos", "agro", "saneamiento"]);
const VALID_GRADOS = new Set<Grado>(["estandar", "reforzado", "extra"]);
const VALID_ORDENES = new Set<OrdenCatalogo>(["capacidad_asc", "capacidad_desc", "nombre"]);

export default function CatalogClient({
  products,
  brands,
  respuestaHoras = 2,
  initialLinea = null,
  categorySlug = null,
  title,
  subtitle,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const rawLinea = searchParams.get("linea") as Linea | null;
  const rawCapacidad = searchParams.get("capacidad");
  const rawUso = searchParams.get("uso") as Uso | null;
  const rawGrado = searchParams.get("grado") as Grado | null;
  const rawMarca = searchParams.get("marca");
  const rawOrden = searchParams.get("orden") as OrdenCatalogo | null;

  const rawCapParts = rawCapacidad ? rawCapacidad.split(",").filter(Boolean) : [];
  const resolvedRangos = rawCapParts
    .map((p) => resolveRangoCapacidad(p))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const resolvedRangoIds = resolvedRangos.map((r) => r.id);
  const resolvedRango = resolvedRangos[0];

  const filters: CatalogFilters = {
    linea: rawLinea && VALID_LINEAS.has(rawLinea) ? rawLinea : initialLinea,
    categoria: categorySlug,
    rangoId: resolvedRango?.id ?? null,
    rangoIds: resolvedRangoIds.length > 0 ? resolvedRangoIds : undefined,
    uso: rawUso && VALID_USOS.has(rawUso) ? rawUso : null,
    grado: rawGrado && VALID_GRADOS.has(rawGrado) ? rawGrado : null,
    marca: rawMarca && brands.some((b) => b.slug === rawMarca) ? rawMarca : null,
    orden: rawOrden && VALID_ORDENES.has(rawOrden) ? rawOrden : "capacidad_asc",
  };

  const updateUrl = (next: CatalogFilters) => {
    const params = new URLSearchParams();
    if (next.rangoIds && next.rangoIds.length > 0) {
      params.set("capacidad", next.rangoIds.join(","));
    } else if (next.rangoId) {
      params.set("capacidad", next.rangoId);
    }
    if (next.linea) params.set("linea", next.linea);
    if (next.uso) params.set("uso", next.uso);
    if (next.grado) params.set("grado", next.grado);
    if (next.marca) params.set("marca", next.marca);
    if (next.orden && next.orden !== "capacidad_asc") params.set("orden", next.orden);

    const qs = params.toString();
    const targetPath = next.categoria ? pathname : "/catalogo/";
    router.replace(qs ? `${targetPath}?${qs}` : targetPath, { scroll: false });
  };

  const handleRemoveFilter = (key: keyof CatalogFilters, specificId?: string) => {
    if (key === "categoria") {
      router.replace("/catalogo/", { scroll: false });
      return;
    }
    if (key === "rangoId" || key === "rangoIds") {
      if (specificId && filters.rangoIds && filters.rangoIds.length > 1) {
        const remaining = filters.rangoIds.filter((id) => id !== specificId);
        updateUrl({
          ...filters,
          rangoId: remaining.length === 1 ? remaining[0] : null,
          rangoIds: remaining,
        });
        return;
      }
      updateUrl({
        ...filters,
        rangoId: null,
        rangoIds: [],
      });
      return;
    }
    updateUrl({
      ...filters,
      [key]: null,
    });
  };

  const handleClearFilters = () => {
    router.replace(categorySlug ? pathname : "/catalogo/", { scroll: false });
  };

  const filteredProducts = filterProducts(products, filters);

  // Conteo reactivo para las pestañas de línea
  const countAll = filterProducts(products, { ...filters, linea: null }).length;
  const countHogar = filterProducts(products, { ...filters, linea: "hogar" }).length;
  const countAgro = filterProducts(products, { ...filters, linea: "agroindustria" }).length;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Cabecera del catálogo inspirada en Catalogo.dc.html */}
      <header className="flex flex-wrap items-end justify-between gap-6 pb-2">
        <div className="flex min-w-[280px] flex-1 flex-col gap-3">
          <h1 className="font-sans text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.05] tracking-[-0.035em] text-[#0e1f2e]">
            {categorySlug ? (
              title
            ) : (
              <>
                Catálogo de tanques
                <span className="block text-[#1769c2]">y accesorios.</span>
              </>
            )}
          </h1>
        </div>

        <div className="flex max-w-[420px] flex-col gap-3.5">
          <p className="font-sans text-[15px] leading-relaxed text-[#45596b] text-justify">
            {subtitle}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="inline-flex cursor-pointer items-center gap-2 font-sans text-sm font-semibold text-[#1769c2] transition-colors hover:text-[#0e1f2e]"
          >
            ¿Qué grado necesito? <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      {/* Selector segmentado de 3 posiciones: Todo / Hogar / Agroindustria */}
      <LineTabs
        activeLinea={filters.linea ?? null}
        counts={{
          all: countAll,
          hogar: countHogar,
          agroindustria: countAgro,
        }}
        onChange={(linea) => updateUrl({ ...filters, linea })}
      />

      {/* Barra de Filtros: 6 rangos de capacidad + filtros secundarios */}
      <FilterBar
        products={products}
        brands={brands}
        filters={filters}
        totalFilteredCount={filteredProducts.length}
        onChange={updateUrl}
        onClearFilters={handleClearFilters}
      />

      {/* Conteo de productos, chips de filtros activos removibles y orden */}
      <ResultCount
        count={filteredProducts.length}
        orden={filters.orden ?? "capacidad_asc"}
        filters={filters}
        brands={brands}
        onChangeOrden={(orden) => updateUrl({ ...filters, orden })}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Grilla de productos o estado vacío */}
      {filteredProducts.length > 0 ? (
        <ProductGrid
          products={filteredProducts}
          brands={brands}
          activeRangoId={filters.rangoId}
          activeRangoIds={filters.rangoIds}
          respuestaHoras={respuestaHoras}
        />
      ) : (
        <EmptyState onClearFilters={handleClearFilters} />
      )}

      {/* Modal Guía Técnica: ¿Qué grado necesito? */}
      <dialog
        ref={dialogRef}
        aria-labelledby="dialog-grados-titulo"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[calc(100%-32px)] max-w-xl rounded-[24px] border border-[#0e1f2e]/10 bg-white p-6 text-[#0e1f2e] shadow-2xl backdrop:bg-[#0e1f2e]/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.08em] text-[#1769c2] uppercase">
              Guía técnica Rotoplas
            </p>
            <h2
              id="dialog-grados-titulo"
              className="mt-1 font-sans text-xl font-bold tracking-tight text-[#0e1f2e]"
            >
              ¿Qué grado de tanque necesito según la densidad?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar guía de grados"
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f1f4f6] text-[#0e1f2e] transition-colors hover:bg-[#e2e8ed]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-3 font-sans text-sm leading-relaxed text-[#5b7083]">
          El grado de reforzamiento del tanque industrial se elige de acuerdo con la densidad del líquido a almacenar (en kg/l):
        </p>

        <div className="mt-5 divide-y divide-[#0e1f2e]/8 overflow-hidden rounded-[16px] border border-[#0e1f2e]/10 bg-[#f8fafc]">
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-sans font-bold text-[#0e1f2e]">Estándar</p>
              <p className="font-sans text-xs text-[#5b7083]">Agua potable (AB), riego y líquidos ligeros</p>
            </div>
            <span className="font-display text-sm font-semibold text-[#1769c2]">
              1.00 a 1.20 kg/l
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 bg-white p-4">
            <div>
              <p className="font-sans font-bold text-[#0e1f2e]">Reforzado</p>
              <p className="font-sans text-xs text-[#5b7083]">Fertilizantes líquidos y químicos de densidad media</p>
            </div>
            <span className="font-display text-sm font-semibold text-[#1769c2]">
              1.21 a 1.50 kg/l
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-sans font-bold text-[#0e1f2e]">Doble reforzado</p>
              <p className="font-sans text-xs text-[#5b7083]">Ácidos concentrados, melaza y reactivos densos</p>
            </div>
            <span className="font-display text-sm font-semibold text-[#1769c2]">
              1.51 a 1.90 kg/l
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            onClick={() => dialogRef.current?.close()}
            className="rounded-xl px-5 text-sm"
          >
            Entendido
          </Button>
        </div>
      </dialog>
    </div>
  );
}
