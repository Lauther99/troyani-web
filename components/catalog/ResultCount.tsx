"use client";

import {
  type CatalogFilters,
  GRADO_LABELS,
  LINEA_LABELS,
  ORDEN_LABELS,
  type OrdenCatalogo,
  resolveRangoCapacidad,
  USO_LABELS,
} from "@/lib/catalog";
import type { Brand } from "@/lib/schemas";

type Props = {
  count: number;
  orden: OrdenCatalogo;
  filters: CatalogFilters;
  brands: Brand[];
  onChangeOrden: (orden: OrdenCatalogo) => void;
  onRemoveFilter: (key: keyof CatalogFilters, specificId?: string) => void;
  onClearFilters: () => void;
};

export default function ResultCount({
  count,
  orden,
  filters,
  brands,
  onChangeOrden,
  onRemoveFilter,
  onClearFilters,
}: Props) {
  const activePills: { id: string; label: string; remove: () => void }[] = [];

  if (filters.linea) {
    activePills.push({
      id: "linea",
      label: `Línea ${LINEA_LABELS[filters.linea]}`,
      remove: () => onRemoveFilter("linea"),
    });
  }

  const rangos =
    filters.rangoIds && filters.rangoIds.length > 0
      ? filters.rangoIds
      : filters.rangoId
        ? [filters.rangoId]
        : [];

  rangos.forEach((rId) => {
    const rango = resolveRangoCapacidad(rId);
    activePills.push({
      id: `rango-${rId}`,
      label: rango?.label ?? `${rId} L`,
      remove: () => onRemoveFilter("rangoId", rId),
    });
  });

  if (filters.uso) {
    activePills.push({
      id: "uso",
      label: USO_LABELS[filters.uso],
      remove: () => onRemoveFilter("uso"),
    });
  }

  if (filters.grado) {
    activePills.push({
      id: "grado",
      label: `Grado ${GRADO_LABELS[filters.grado]}`,
      remove: () => onRemoveFilter("grado"),
    });
  }

  if (filters.marca) {
    const brand = brands.find((b) => b.slug === filters.marca);
    activePills.push({
      id: "marca",
      label: brand?.nombre ?? filters.marca,
      remove: () => onRemoveFilter("marca"),
    });
  }

  if (filters.categoria) {
    activePills.push({
      id: "categoria",
      label: `Categoría: ${filters.categoria}`,
      remove: () => onRemoveFilter("categoria"),
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      {/* Conteo y pills de filtros activos */}

      {/* Selector de Orden */}
      <label className="flex items-center gap-2.5 font-sans text-[13px] text-[#5b7083]">
        Ordenar
        <span className="relative flex items-center">
          <select
            value={orden}
            onChange={(e) => onChangeOrden(e.target.value as OrdenCatalogo)}
            style={{ backgroundColor: "#ffffff" }}
            className="h-[38px] cursor-pointer appearance-none rounded-xl border-[1.5px] border-[#0e1f2e]/14 pl-3.5 pr-9 font-sans text-[13px] font-medium text-[#0e1f2e] transition-colors focus:border-[#1769c2] focus:outline-none"
          >
            {(Object.keys(ORDEN_LABELS) as OrdenCatalogo[]).map((key) => (
              <option key={key} value={key}>
                {ORDEN_LABELS[key].charAt(0).toUpperCase() + ORDEN_LABELS[key].slice(1)}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 size-3"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m3 4.5 3 3 3-3"
              stroke="#0e1f2e"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>
    </div>
  );
}
