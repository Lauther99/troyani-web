import type { Grado, Linea, Product, Uso } from "@/lib/schemas";

/**
 * Rangos de capacidad (wireframe pág. 8): el filtro y el selector del Hero hablan el mismo idioma.
 * La URL lleva un valor de referencia (?capacidad=2500) y se resuelve al rango que lo contiene.
 */
export type RangoCapacidad = { id: string; min: number; max: number | null; label: string };

export const RANGOS_CAPACIDAD: RangoCapacidad[] = [
  { id: "600", min: 0, max: 600, label: "≤ 600 L" },
  { id: "1200", min: 601, max: 1200, label: "601 a 1,200 L" },
  { id: "2800", min: 1201, max: 2800, label: "1,201 a 2,800 L" },
  { id: "5000", min: 2801, max: 5000, label: "2,801 a 5,000 L" },
  { id: "10000", min: 5001, max: 10000, label: "5,001 a 10,000 L" },
  { id: "25000", min: 10001, max: 25000, label: "10,001 a 25,000 L" },
];

/** Pills del Hero: valor de referencia → rango. Cada pill es un enlace a /catalogo/?capacidad={valor}. */
export const PILLS_HERO = [
  { valor: 700, label: "700 L" },
  { valor: 1100, label: "1,100 L" },
  { valor: 2500, label: "2,500 L" },
  { valor: 5000, label: "5,000 L" },
  { valor: 10000, label: "10,000 L" },
  { valor: 25000, label: "25,000 L" },
];

export function rangoDe(litros: number): RangoCapacidad | undefined {
  return RANGOS_CAPACIDAD.find((r) => litros >= r.min && (r.max === null || litros <= r.max));
}

export function resolveRangoCapacidad(valor?: string | null): RangoCapacidad | undefined {
  if (!valor) return undefined;
  const byId = RANGOS_CAPACIDAD.find((r) => r.id === valor);
  if (byId) return byId;
  const num = Number(valor);
  if (!Number.isFinite(num) || num <= 0) return undefined;
  return rangoDe(num);
}

export const LINEA_LABELS: Record<Linea, string> = {
  hogar: "Hogar",
  agroindustria: "Agroindustria",
};

export const USO_LABELS: Record<Uso, string> = {
  agua: "Agua",
  quimicos: "Químicos",
  agro: "Agro",
  saneamiento: "Saneamiento",
};

export const GRADO_LABELS: Record<Grado, string> = {
  estandar: "Estándar",
  reforzado: "Reforzado",
  extra: "Doble reforzado",
};

export type OrdenCatalogo = "capacidad_asc" | "capacidad_desc" | "nombre";

export const ORDEN_LABELS: Record<OrdenCatalogo, string> = {
  capacidad_asc: "capacidad ascendente",
  capacidad_desc: "capacidad descendente",
  nombre: "nombre (A-Z)",
};

export type CatalogFilters = {
  linea?: Linea | null;
  categoria?: string | null;
  rangoId?: string | null;
  rangoIds?: string[];
  uso?: Uso | null;
  grado?: Grado | null;
  marca?: string | null;
  orden?: OrdenCatalogo;
};

/** Capacidades en litros declaradas por un producto o línea de producto. */
export function capacidadesProducto(product: Product): number[] {
  if (product.capacidades && product.capacidades.length > 0) {
    return [...new Set(product.capacidades.map((c) => c.capacidad_l))].sort((a, b) => a - b);
  }
  return product.capacidad_l !== null ? [product.capacidad_l] : [];
}

export function matchesRango(product: Product, rango: RangoCapacidad): boolean {
  const caps = capacidadesProducto(product);
  if (caps.length === 0) return false;
  return caps.some((c) => c >= rango.min && (rango.max === null || c <= rango.max));
}

export function matchesGrado(product: Product, grado: Grado): boolean {
  if (product.grado?.nivel === grado) return true;
  if (!product.grados_densidad || product.grados_densidad.length === 0) return false;
  return product.grados_densidad.some((g) => {
    const norm = g.tipo_tanque.toLowerCase();
    if (grado === "estandar") return norm.includes("estándar") || norm.includes("estandar");
    if (grado === "reforzado") return norm === "reforzado";
    if (grado === "extra") return norm.includes("doble") || norm.includes("extra");
    return false;
  });
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const rango = resolveRangoCapacidad(filters.rangoId);
  const activeRangos = (filters.rangoIds ?? [])
    .map((id) => resolveRangoCapacidad(id))
    .filter((r): r is RangoCapacidad => Boolean(r));

  const filtered = products.filter((p) => {
    if (filters.linea && p.linea !== filters.linea) return false;
    if (filters.categoria && p.categoria !== filters.categoria) return false;
    if (activeRangos.length > 0) {
      if (!activeRangos.some((rg) => matchesRango(p, rg))) return false;
    } else if (rango && !matchesRango(p, rango)) {
      return false;
    }
    if (filters.uso && !p.usos.includes(filters.uso)) return false;
    if (filters.grado && !matchesGrado(p, filters.grado)) return false;
    if (filters.marca && p.marca !== filters.marca) return false;
    return true;
  });

  const orden = filters.orden ?? "capacidad_asc";

  return [...filtered].sort((a, b) => {
    if (orden === "nombre") {
      return a.nombre.localeCompare(b.nombre, "es-PE");
    }
    const capsA = capacidadesProducto(a);
    const capsB = capacidadesProducto(b);
    if (capsA.length === 0 && capsB.length === 0) return a.nombre.localeCompare(b.nombre, "es-PE");
    if (capsA.length === 0) return 1;
    if (capsB.length === 0) return -1;

    if (orden === "capacidad_desc") {
      return Math.max(...capsB) - Math.max(...capsA);
    }
    return Math.min(...capsA) - Math.min(...capsB);
  });
}

/**
 * Rango real de una lista de productos ("250 L a 25,000 L"), calculado desde lo publicado.
 * Nunca se escribe a mano (wireframe pág. 5, bloque 03).
 */
export function rangoLitros(products: Product[]): { min: number; max: number } | null {
  const caps = products.flatMap((p) => capacidadesProducto(p));
  return caps.length ? { min: Math.min(...caps), max: Math.max(...caps) } : null;
}
