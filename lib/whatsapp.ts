import systemJson from "@/content/system.json";
import { formatNumero, formatPEN } from "@/lib/format";
import { precioUnitario, type PrecioEfectivo } from "@/lib/products";
import { site } from "@/lib/site";

/**
 * Enlaces wa.me con mensaje armado (wireframe págs. 10 y 16).
 * Sin dependencias de servidor: se usa también en componentes cliente.
 * Los textos viven en content/system.json; los marcadores son {nombre}, nunca {{ }}.
 */
const textos = systemJson.whatsapp;

export function whatsappUrl(mensaje: string): string {
  return `https://wa.me/${site.whatsapp_e164}?text=${encodeURIComponent(mensaje)}`;
}

/** Reemplaza {clave} por su valor. */
function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
}

const urlDe = (path: string) => `${site.dominio}${path}`;

/** CTA genérico (header, sticky bar de la Home). Incluye la página de origen si no es la Home. */
export function mensajeGenerico(path?: string): string {
  return path && path !== "/" ? `${textos.generico}\n${urlDe(path)}` : textos.generico;
}

export const mensajeContacto = () => textos.contacto;

/** Desde el 404: ventas sabe qué enlace llegó roto. */
export const mensajeNoEncontrado = (path: string) => fill(textos.no_encontrado, { url: urlDe(path) });

/** Estado vacío del catálogo (P7): lleva los filtros activos, p. ej. "tanque reforzado de 25,000 L o más". */
export const mensajeCatalogoVacio = (busqueda: string) => fill(textos.catalogo_vacio, { busqueda });

/**
 * Mensaje de cotización de un producto (panel, sticky bar, P8):
 *   Hola Troyani, quiero cotizar:
 *   · Tanque industrial Rotoplas 10,000 L
 *   · Cantidad: 3 und
 *   · Entrega: Arequipa                         (si hay ubicación)
 *   · Precio web: S/ 1,250.00 c/u inc. IGV      (solo con precio fijo vigente)
 *   troyani.com/productos/{slug}/
 */
export function buildQuoteMessage({
  producto,
  precio,
  cantidad = 1,
  ubicacion,
}: {
  producto: { nombre: string; slug: string };
  precio: PrecioEfectivo;
  cantidad?: number;
  ubicacion?: string;
}): string {
  const unitario = precioUnitario(precio, cantidad);
  const lineas = [
    textos.cotizar_producto,
    `· ${producto.nombre}`,
    `· Cantidad: ${formatNumero(cantidad)} und`,
    ubicacion ? `· Entrega: ${ubicacion}` : null,
    unitario !== null
      ? `· Precio web: ${formatPEN(unitario)} c/u inc. IGV`
      : null,
    urlDe(`/productos/${producto.slug}/`),
  ];
  return lineas.filter(Boolean).join("\n");
}

/** Mensaje del formulario rápido B2B del cierre de la Home (wireframe pág. 6, bloque 07). */
export function buildQuickQuoteMessage({
  ruc,
  celular,
  producto,
  cantidad,
}: {
  ruc?: string;
  celular: string;
  producto: string;
  cantidad: number;
}): string {
  const lineas = [
    textos.cotizar_producto,
    `· Producto: ${producto.trim()}`,
    `· Cantidad: ${formatNumero(cantidad)} und`,
    ruc?.trim() ? `· RUC: ${ruc.trim()}` : null,
    `· Celular: ${celular.trim()}`,
  ];
  return lineas.filter(Boolean).join("\n");
}
