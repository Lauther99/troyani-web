/**
 * Formato es-PE (Intl): miles con coma y decimales con punto, como en el wireframe.
 * 10000 → "10,000" · 1250 → "S/ 1,250.00"
 */
const numero = new Intl.NumberFormat("es-PE");
const soles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const fecha = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "America/Lima",
});

export const formatNumero = (n: number) => numero.format(n);

/** 10000 → "10,000 L" */
export const formatLitros = (litros: number) => `${numero.format(litros)} L`;

/** 1250 → "S/ 1,250.00" */
export const formatPEN = (pen: number) => soles.format(pen);

/** 220 → "220 cm" */
export const formatCm = (cm: number) => `${numero.format(cm)} cm`;

/** "2026-10-01" → "1 oct 2026" */
export const formatFecha = (iso: string) => fecha.format(new Date(`${iso}T12:00:00-05:00`)).replace(/\./g, "");

const mesAnio = new Intl.DateTimeFormat("es-PE", {
  month: "short",
  year: "numeric",
  timeZone: "America/Lima",
});

/** "2026-08" → "AGO 2026" */
export const formatMesAnio = (ym: string) =>
  mesAnio.format(new Date(`${ym}-15T12:00:00-05:00`)).replace(/\./g, "").toUpperCase();

/**
 * Formatea un número E.164 peruano (51 + 9 dígitos) como "+51 999 999 999".
 * Si no tiene ese patrón, lo devuelve con "+" sin agrupar.
 */
export function formatTelefono(e164: string): string {
  const match = e164.match(/^51(\d{3})(\d{3})(\d{3})$/);
  return match ? `+51 ${match[1]} ${match[2]} ${match[3]}` : `+${e164}`;
}

/**
 * Dimensiones técnicas en una línea (wireframe pág. 6):
 * - cilíndrica/cónica: "Ø 240 cm × Alt 285 cm · GE 1.5" (corto en móvil: "Ø 240 × 285 cm")
 * - rectangular:       "L 240 × An 180 × Alt 165 cm"    (corto en móvil: "240 × 180 × 165 cm")
 */
export function formatDimensiones(
  dimensiones: {
    forma: "cilindrica_vertical" | "cilindrica_horizontal" | "rectangular" | "conica";
    diametro_cm: number | null;
    largo_cm: number | null;
    ancho_cm: number | null;
    alto_cm: number | null;
  } | null,
  grado: { gravedad_especifica_max: number } | null,
  medidaNominal: string | null,
  corto = false,
): string {
  if (!dimensiones) return medidaNominal ?? "";
  if (dimensiones.forma === "rectangular") {
    const l = dimensiones.largo_cm ? numero.format(dimensiones.largo_cm) : "";
    const an = dimensiones.ancho_cm ? numero.format(dimensiones.ancho_cm) : "";
    const al = dimensiones.alto_cm ? numero.format(dimensiones.alto_cm) : "";
    return corto ? `${l} × ${an} × ${al} cm` : `L ${l} × An ${an} × Alt ${al} cm`;
  }
  const d = dimensiones.diametro_cm ? numero.format(dimensiones.diametro_cm) : "";
  const al = dimensiones.alto_cm ? numero.format(dimensiones.alto_cm) : "";
  if (corto) return `Ø ${d} × ${al} cm`;
  const ge = grado ? ` · GE ${grado.gravedad_especifica_max.toFixed(1)}` : "";
  return `Ø ${d} × Alt ${al} cm${ge}`;
}
