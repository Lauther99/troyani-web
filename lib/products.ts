import type { Product } from "@/lib/schemas";

/**
 * Precio y stock se envejecen (wireframe pág. 4). Nunca se muestra un dato vencido como vigente:
 * - precio fijo con más de 30 días → "Precio por cotización"
 * - disponibilidad con más de 15 días → "Consultar disponibilidad"
 * Se evalúa al renderizar; con revalidate = 86400 la degradación ocurre sola, sin deploy.
 */
export const DIAS_VIGENCIA_PRECIO = 30;
export const DIAS_VIGENCIA_STOCK = 15;

const DIA_MS = 24 * 60 * 60 * 1000;

function diasDesde(fechaIso: string, ahora: Date): number {
  return Math.floor((ahora.getTime() - new Date(`${fechaIso}T00:00:00-05:00`).getTime()) / DIA_MS);
}

export type PrecioEfectivo =
  | { modo: "fijo"; cotizacion: false; pen: number; escala: { desde_und: number; pen_unitario: number }[] }
  | { modo: "cotizacion"; cotizacion: true; vencido: boolean };

export function precioEfectivo(p: Product, ahora = new Date()): PrecioEfectivo {
  if (p.precio.modo === "cotizacion" || p.precio.cotizacion) {
    return { modo: "cotizacion", cotizacion: true, vencido: false };
  }
  if (diasDesde(p.precio.actualizado, ahora) > DIAS_VIGENCIA_PRECIO) {
    return { modo: "cotizacion", cotizacion: true, vencido: true };
  }
  return { modo: "fijo", cotizacion: false, pen: p.precio.pen, escala: p.precio.escala_volumen };
}

/** Precio unitario para una cantidad, aplicando la escala por volumen si corresponde. */
export function precioUnitario(precio: PrecioEfectivo, cantidad: number): number | null {
  if (precio.modo !== "fijo") return null;
  const tramo = [...precio.escala].reverse().find((e) => cantidad >= e.desde_und);
  return tramo?.pen_unitario ?? precio.pen;
}

export type DisponibilidadEfectiva =
  | { estado: "stock"; almacen: string }
  | { estado: "a_pedido"; dias: number }
  | { estado: "consultar" };

export function disponibilidadEfectiva(p: Product, ahora = new Date()): DisponibilidadEfectiva {
  const d = p.disponibilidad;
  if (d.estado === "consultar" || diasDesde(d.actualizado, ahora) > DIAS_VIGENCIA_STOCK) return { estado: "consultar" };
  if (d.estado === "stock") return { estado: "stock", almacen: d.almacen ?? "" };
  return { estado: "a_pedido", dias: d.dias_entrega ?? 0 };
}
