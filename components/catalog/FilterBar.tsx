"use client";

import { useEffect, useState } from "react";
import {
  type CatalogFilters,
  filterProducts,
  GRADO_LABELS,
  RANGOS_CAPACIDAD,
  USO_LABELS,
} from "@/lib/catalog";
import type { Brand, Grado, Linea, Product, Uso } from "@/lib/schemas";

type Props = {
  products: Product[];
  brands: Brand[];
  filters: CatalogFilters;
  totalFilteredCount?: number;
  onChange: (next: CatalogFilters) => void;
  onClearFilters: () => void;
};

const LINEAS: { key: Linea | null; label: string }[] = [
  { key: null, label: "Todo" },
  { key: "hogar", label: "Hogar" },
  { key: "agroindustria", label: "Agroindustria" },
];

const USOS: Uso[] = ["agua", "quimicos", "agro", "saneamiento"];
const GRADOS: Grado[] = ["estandar", "reforzado", "extra"];

type DrawerPillProps = {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
};

function DrawerPill({ label, count, isSelected, onClick }: DrawerPillProps) {
  const isZero = count === 0 && !isSelected;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isZero}
      style={{
        backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
        color: isSelected ? "#ffffff" : isZero ? "#a3b1bd" : "#0e1f2e",
        borderColor: isSelected
          ? "#0e1f2e"
          : isZero
            ? "rgba(14,31,46,0.08)"
            : "rgba(14,31,46,0.14)",
      }}
      className={`inline-flex h-[42px] items-center gap-2.5 rounded-full border-[1.5px] px-3.5 font-sans text-[13.5px] font-semibold transition-all ${
        isZero ? "cursor-not-allowed opacity-45" : "cursor-pointer"
      }`}
    >
      <span>{label}</span>
      <span
        style={{
          backgroundColor: isSelected
            ? "#1769c2"
            : isZero
              ? "rgba(14,31,46,0.05)"
              : "#f1f4f6",
          color: isSelected ? "#ffffff" : isZero ? "#a3b1bd" : "#5b7083",
        }}
        className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 font-display text-[11px] font-semibold tabular-nums"
      >
        {count}
      </span>
    </button>
  );
}

export default function FilterBar({
  products,
  brands,
  filters,
  totalFilteredCount,
  onChange,
  onClearFilters,
}: Props) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSheetOpen]);

  const activeRangoIds =
    filters.rangoIds ?? (filters.rangoId ? [filters.rangoId] : []);

  const toggleRango = (id: string) => {
    const nextIds = activeRangoIds.includes(id)
      ? activeRangoIds.filter((x) => x !== id)
      : [...activeRangoIds, id];

    onChange({
      ...filters,
      rangoId: nextIds.length === 1 ? nextIds[0] : null,
      rangoIds: nextIds,
    });
  };

  const countForLinea = (lineaKey: Linea | null): number => {
    return filterProducts(products, {
      ...filters,
      linea: lineaKey,
    }).length;
  };

  const countForRango = (rangoId: string): number => {
    return filterProducts(products, {
      ...filters,
      rangoId,
      rangoIds: undefined,
    }).length;
  };

  const countForUso = (u: Uso): number => {
    return filterProducts(products, {
      ...filters,
      uso: u,
    }).length;
  };

  const countForGrado = (g: Grado): number => {
    return filterProducts(products, {
      ...filters,
      grado: g,
    }).length;
  };

  const countForMarca = (slug: string): number => {
    return filterProducts(products, {
      ...filters,
      marca: slug,
    }).length;
  };

  const activeFiltersCount =
    (filters.linea ? 1 : 0) +
    activeRangoIds.length +
    (filters.uso ? 1 : 0) +
    (filters.grado ? 1 : 0) +
    (filters.marca ? 1 : 0);

  const total = totalFilteredCount ?? filterProducts(products, filters).length;

  return (
    <>
      {/* Botón trigger para pantallas móviles (Exacto a Imagen 1, Sticky al hacer scroll) */}
      <div className="sticky top-[var(--header-h,64px)] z-30 -mx-1 block bg-[#f4f6f7]/95 px-1 py-2 backdrop-blur-md sm:hidden">
        <button
          type="button"
          onClick={() => setMobileSheetOpen(true)}
          style={{ backgroundColor: "#ffffff" }}
          className="flex h-[62px] w-full cursor-pointer items-center justify-between gap-3 rounded-[20px] border border-[#0e1f2e]/12 px-4 shadow-[0_4px_16px_rgba(14,31,46,0.06)] transition-all hover:border-[#0e1f2e]/25"
        >
          <span className="flex items-center gap-3">
            {/* Icono de 3 barras horizontales centradas */}
            <svg
              className="size-5 text-[#0e1f2e]"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M3 5.5h14M5 10h10M7 14.5h6" />
            </svg>
            <span className="font-sans text-[16px] font-bold text-[#0e1f2e]">
              Filtrar productos
            </span>
          </span>

          {activeFiltersCount > 0 && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#1769c2] font-sans text-base font-bold text-white shadow-sm">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Contenedor desktop (Tarjetas de litraje + filtros secundarios) */}
      <div
        style={{ backgroundColor: "#ffffff" }}
        className="hidden flex-col gap-5 rounded-[24px] border border-[#0e1f2e]/8 p-6 shadow-[0_24px_60px_-40px_rgba(14,31,46,0.35)] sm:flex"
      >
        {/* Selector de Capacidad desktop */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
              Capacidad
            </span>
            <span className="font-sans text-xs tracking-normal text-[#8a9aa8]">
              Selecciona uno o varios rangos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {RANGOS_CAPACIDAD.map((rango, i) => {
              const isSelected = activeRangoIds.includes(rango.id);
              const n = countForRango(rango.id);
              const iconW = 14 + i * 2.5;
              const iconH = 16 + i * 4.5;

              return (
                <button
                  key={rango.id}
                  type="button"
                  onClick={() => toggleRango(rango.id)}
                  style={{
                    backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
                    color: isSelected ? "#ffffff" : n === 0 ? "#a3b1bd" : "#0e1f2e",
                    borderColor: isSelected ? "#0e1f2e" : "rgba(14,31,46,0.14)",
                  }}
                  className="group flex min-h-[76px] cursor-pointer items-end gap-3 rounded-[16px] border-[1.5px] p-3 text-left transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span
                    style={{
                      width: `${iconW}px`,
                      height: `${iconH}px`,
                      borderColor: isSelected ? "#8fc0f0" : "#1769c2",
                      backgroundColor: isSelected
                        ? "rgba(143,192,240,0.25)"
                        : "#eaf2fb",
                    }}
                    className="relative flex shrink-0 rounded-[4px] border-[1.5px] transition-all"
                  >
                    <span
                      style={{
                        backgroundColor: isSelected ? "#8fc0f0" : "#1769c2",
                      }}
                      className="absolute inset-x-[30%] -top-1 h-[3px] rounded-t-[2px]"
                    />
                  </span>

                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-sans text-[13.5px] font-semibold leading-tight">
                      {rango.label}
                    </span>
                    <span className="truncate font-display text-[10.5px] tracking-[0.04em] opacity-70">
                      {n === 1 ? "1 producto" : `${n} productos`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#0e1f2e]/8" />

        {/* Filtros secundarios desktop */}
        <div className="flex flex-col gap-3.5">
          {/* Uso */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
              Uso
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...filters, uso: null })}
              style={{
                backgroundColor: !filters.uso ? "#0e1f2e" : "#ffffff",
                color: !filters.uso ? "#ffffff" : "#0e1f2e",
                borderColor: !filters.uso ? "#0e1f2e" : "rgba(14,31,46,0.14)",
              }}
              className="h-[34px] cursor-pointer rounded-full border-[1.5px] px-3.5 font-sans text-[13px] font-medium transition-colors"
            >
              Todas
            </button>
            {USOS.map((uso) => {
              const isSelected = filters.uso === uso;
              return (
                <button
                  key={uso}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      uso: isSelected ? null : uso,
                    })
                  }
                  style={{
                    backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#0e1f2e",
                    borderColor: isSelected ? "#0e1f2e" : "rgba(14,31,46,0.14)",
                  }}
                  className="h-[34px] cursor-pointer rounded-full border-[1.5px] px-3.5 font-sans text-[13px] font-medium transition-colors"
                >
                  {USO_LABELS[uso]}
                </button>
              );
            })}
          </div>

          {/* Grado */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
              Grado
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...filters, grado: null })}
              style={{
                backgroundColor: !filters.grado ? "#0e1f2e" : "#ffffff",
                color: !filters.grado ? "#ffffff" : "#0e1f2e",
                borderColor: !filters.grado ? "#0e1f2e" : "rgba(14,31,46,0.14)",
              }}
              className="h-[34px] cursor-pointer rounded-full border-[1.5px] px-3.5 font-sans text-[13px] font-medium transition-colors"
            >
              Todas
            </button>
            {GRADOS.map((grado) => {
              const isSelected = filters.grado === grado;
              return (
                <button
                  key={grado}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      grado: isSelected ? null : grado,
                    })
                  }
                  style={{
                    backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#0e1f2e",
                    borderColor: isSelected ? "#0e1f2e" : "rgba(14,31,46,0.14)",
                  }}
                  className="h-[34px] cursor-pointer rounded-full border-[1.5px] px-3.5 font-sans text-[13px] font-medium transition-colors"
                >
                  {GRADO_LABELS[grado]}
                </button>
              );
            })}
          </div>

          {/* Marca */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
              Marca
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...filters, marca: null })}
              style={{
                backgroundColor: !filters.marca ? "#0e1f2e" : "#ffffff",
                color: !filters.marca ? "#ffffff" : "#0e1f2e",
                borderColor: !filters.marca ? "#0e1f2e" : "rgba(14,31,46,0.14)",
              }}
              className="h-[34px] cursor-pointer rounded-full border-[1.5px] px-3.5 font-sans text-[13px] font-medium transition-colors"
            >
              Todas
            </button>
            {brands.map((b) => {
              const isSelected = filters.marca === b.slug;
              return (
                <button
                  key={b.slug}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      marca: isSelected ? null : b.slug,
                    })
                  }
                  style={{
                    backgroundColor: isSelected ? "#0e1f2e" : "#ffffff",
                    color: isSelected ? "#ffffff" : "#0e1f2e",
                    borderColor: isSelected ? "#0e1f2e" : "rgba(14,31,46,0.14)",
                  }}
                  className="h-[34px] cursor-pointer rounded-full border-[1.5px] px-3.5 font-sans text-[13px] font-medium transition-colors"
                >
                  {b.nombre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drawer modal para móvil (Fiel a Imagen 2) */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop con blur */}
          <div
            onClick={() => setMobileSheetOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-[#0e1f2e]/60 backdrop-blur-[4px] transition-opacity"
          />

          {/* Sheet Container 100% opaco */}
          <div
            style={{ backgroundColor: "#ffffff" }}
            className="relative z-10 flex max-h-[88vh] w-full flex-col rounded-t-[28px] shadow-[0_-12px_40px_rgba(14,31,46,0.35)]"
          >
            {/* Header del drawer fijo */}
            <div
              style={{ backgroundColor: "#ffffff" }}
              className="shrink-0 rounded-t-[28px] border-b border-[#0e1f2e]/8 px-5 pt-3 pb-3"
            >
              <div className="mx-auto mb-3 h-1 w-11 rounded-full bg-[#0e1f2e]/20" />
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-[20px] font-bold tracking-[-0.02em] text-[#0e1f2e]">
                  Filtros
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  aria-label="Cerrar filtros"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#f1f4f6] text-[20px] leading-none text-[#0e1f2e] transition-colors hover:bg-[#e2e8ed]"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido scrolleable con las 5 secciones (Exacto a Imagen 2) */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-5">
                {/* 1. LÍNEA */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
                      Línea
                    </span>
                    <span className="font-sans text-xs text-[#8a9aa8]">
                      Elige una
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LINEAS.map((l) => {
                      const isSelected =
                        l.key === null
                          ? !filters.linea
                          : filters.linea === l.key;
                      const n = countForLinea(l.key);

                      return (
                        <DrawerPill
                          key={l.label}
                          label={l.label}
                          count={n}
                          isSelected={isSelected}
                          onClick={() =>
                            onChange({
                              ...filters,
                              linea: l.key,
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 2. CAPACIDAD */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
                      Capacidad
                    </span>
                    <span className="font-sans text-xs text-[#8a9aa8]">
                      Uno o varios
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RANGOS_CAPACIDAD.map((rango) => {
                      const isSelected = activeRangoIds.includes(rango.id);
                      const n = countForRango(rango.id);

                      return (
                        <DrawerPill
                          key={rango.id}
                          label={rango.label}
                          count={n}
                          isSelected={isSelected}
                          onClick={() => toggleRango(rango.id)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 3. USO */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
                      Uso
                    </span>
                    <span className="font-sans text-xs text-[#8a9aa8]">
                      Uno o varios
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {USOS.map((uso) => {
                      const isSelected = filters.uso === uso;
                      const n = countForUso(uso);

                      return (
                        <DrawerPill
                          key={uso}
                          label={USO_LABELS[uso]}
                          count={n}
                          isSelected={isSelected}
                          onClick={() =>
                            onChange({
                              ...filters,
                              uso: isSelected ? null : uso,
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 4. GRADO */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
                      Grado
                    </span>
                    <span className="font-sans text-xs text-[#8a9aa8]">
                      Uno o varios
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {GRADOS.map((grado) => {
                      const isSelected = filters.grado === grado;
                      const n = countForGrado(grado);

                      return (
                        <DrawerPill
                          key={grado}
                          label={GRADO_LABELS[grado]}
                          count={n}
                          isSelected={isSelected}
                          onClick={() =>
                            onChange({
                              ...filters,
                              grado: isSelected ? null : grado,
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 5. MARCA */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-medium tracking-[0.12em] text-[#5b7083] uppercase">
                      Marca
                    </span>
                    <span className="font-sans text-xs text-[#8a9aa8]">
                      Uno o varios
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((b) => {
                      const isSelected = filters.marca === b.slug;
                      const n = countForMarca(b.slug);

                      return (
                        <DrawerPill
                          key={b.slug}
                          label={b.nombre}
                          count={n}
                          isSelected={isSelected}
                          onClick={() =>
                            onChange({
                              ...filters,
                              marca: isSelected ? null : b.slug,
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con botones fijos (Limpiar + Ver N productos) */}
            <div
              style={{ backgroundColor: "#ffffff" }}
              className="shrink-0 border-t border-[#0e1f2e]/8 px-5 py-3.5 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(14,31,46,0.04)]"
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClearFilters();
                  }}
                  style={{ backgroundColor: "#ffffff" }}
                  className="h-12 cursor-pointer rounded-[14px] border-[1.5px] border-[#0e1f2e]/16 px-5 font-sans text-sm font-semibold text-[#0e1f2e] transition-colors hover:bg-[#f4f6f7]"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[14px] bg-[#0e1f2e] font-sans text-[15px] font-semibold text-white transition-colors hover:bg-[#1b344b]"
                >
                  Ver {total} {total === 1 ? "producto" : "productos"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
