import systemJson from "@/content/system.json";
import { cx } from "@/lib/cx";
import { formatPEN } from "@/lib/format";
import type { PrecioEfectivo } from "@/lib/products";

/**
 * Precio en S/ inc. IGV, o "Precio por cotización" (wireframe págs. 4, 6 y 9).
 * Nunca se muestra S/ 0.00 ni un precio vencido como vigente.
 */
type Props = {
  precio: PrecioEfectivo;
  /** Tamaño compacto para cards horizontales móviles. */
  compact?: boolean;
  /** Muestra la nota secundaria ("inc. IGV" o "respuesta en {n} h"). */
  showNote?: boolean;
  respuestaHoras?: number;
  className?: string;
};

export default function PriceTag({
  precio,
  compact = false,
  showNote = true,
  respuestaHoras = 2,
  className,
}: Props) {
  if (precio.modo === "fijo") {
    return (
      <div className={cx("flex flex-col", className)}>
        <span className={cx("cifra text-primary", compact ? "text-[17px] leading-tight" : "text-xl leading-tight")}>
          {formatPEN(precio.pen)}
        </span>
        {showNote && <span className="text-xs text-text-muted">{systemJson.precio.inc_igv}</span>}
      </div>
    );
  }

  if (precio.cotizacion) {
    return null;
  }

  return (
    <div className={cx("flex flex-col", className)}>
      <span
        className={cx(
          "font-display font-bold text-primary",
          compact ? "text-[15px] leading-tight" : "text-lg leading-tight",
        )}
      >
        {systemJson.precio.cotizacion}
      </span>
      {showNote && <span className="text-xs text-text-muted">respuesta en {respuestaHoras} h</span>}
    </div>
  );
}
