import { site } from "@/lib/site";

/** Banda de demostración. Desaparece con "modo_demo": false en content/site.json. */
export default function DemoBanner() {
  if (!site.modo_demo) return null;

  return (
    <div role="note" className="border-b border-tint-tech-border bg-tint-tech">
      <p className="container-site py-1.5 text-center text-caption font-medium text-secondary">
        <span className="font-bold">DEMO</span> · Productos, precios y stock son datos de referencia, no ofertas reales.
      </p>
    </div>
  );
}
