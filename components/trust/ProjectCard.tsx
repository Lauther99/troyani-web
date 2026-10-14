import Image from "next/image";
import { cx } from "@/lib/cx";
import { formatLitros, formatMesAnio, formatNumero } from "@/lib/format";
import type { Project } from "@/lib/schemas";

/**
 * Card de proyecto (wireframe págs. 6, 7 y 14):
 * - Las cifras (unidades y litros totales) se calculan desde `project.items`, nunca a mano.
 * - `variant="vertical"`: 16:9 arriba para desktop.
 * - `variant="horizontal"`: miniatura 72×56 px a la izquierda para móvil.
 */
type Props = {
  project: Project;
  variant?: "vertical" | "horizontal";
};

export function calcularTotalesProyecto(project: Project): {
  unidades: number;
  litros: number;
  resumen: string;
} {
  const unidades = project.items.reduce((acc, i) => acc + i.cantidad, 0);
  const litros = project.items.reduce((acc, i) => acc + i.cantidad * i.capacidad_l, 0);
  const sustantivo = unidades === 1 ? "tanque" : "tanques";
  return {
    unidades,
    litros,
    resumen: `${formatNumero(unidades)} ${sustantivo} · ${formatLitros(litros)} totales`,
  };
}

export default function ProjectCard({ project, variant = "vertical" }: Props) {
  const { resumen } = calcularTotalesProyecto(project);
  const meta = `${project.cliente} · ${project.region} · ${formatMesAnio(project.fecha)}`;

  if (variant === "horizontal") {
    return (
      <article className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
        <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-control bg-bg">
          {project.foto && (
            <Image
              src={project.foto.src}
              alt={project.foto.alt}
              fill
              sizes="72px"
              className="object-contain p-1.5"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10.5px] font-semibold tracking-[0.08em] text-text-muted uppercase">
            {meta}
          </p>
          <p className="cifra mt-0.5 text-[15px] leading-snug text-primary">{resumen}</p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cx(
        "flex flex-col overflow-hidden rounded-card border border-border bg-surface",
        "transition-[border-color,box-shadow] duration-200 ease-out hover:border-border-strong hover:shadow-card",
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-bg">
        {project.foto && (
          <Image
            src={project.foto.src}
            alt={project.foto.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-4"
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">{meta}</p>
        <p className="cifra text-lg leading-snug text-primary">{resumen}</p>
      </div>
    </article>
  );
}
