"use client";

import { mensajeCatalogoVacio, whatsappUrl } from "@/lib/whatsapp";

type Props = {
  onClearFilters: () => void;
};

export default function EmptyState({ onClearFilters }: Props) {
  const waHref = whatsappUrl(
    mensajeCatalogoVacio("tanques y accesorios con especificaciones especiales"),
  );

  return (
    <div className="flex flex-col items-center gap-3.5 rounded-[24px] border-[1.5px] border-dashed border-[#0e1f2e]/15 bg-white p-12 text-center md:py-16">
      <span className="font-sans text-xl font-semibold tracking-[-0.02em] text-[#0e1f2e]">
        Ningún producto coincide con estos filtros
      </span>
      <span className="max-w-md font-sans text-sm text-[#5b7083]">
        Prueba quitando algún filtro o escríbenos para una solución a medida según los requerimientos de tu proyecto.
      </span>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onClearFilters}
          className="h-11 cursor-pointer rounded-full bg-[#0e1f2e] px-6 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#1b344b]"
        >
          Limpiar filtros
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border-[1.5px] border-[#0e1f2e]/16 bg-white px-6 font-sans text-sm font-semibold text-[#0e1f2e] transition-colors hover:bg-[#f4f6f7]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
