import ProjectCard from "@/components/trust/ProjectCard";
import type { Project } from "@/lib/schemas";

/**
 * 06 · Proyectos y despachos en obra (wireframe págs. 6 y 7):
 * - Bloque condicional: solo se renderiza si hay 3 o más proyectos con permiso escrito (`permiso_publicar: true`).
 * - Desktop: 3 cards 16:9 en grilla de 3 columnas.
 * - Móvil: 2 cards horizontales compactas.
 */
export default function ProjectsStrip({ projects }: { projects: Project[] }) {
  if (projects.length < 3) return null;

  const desktopItems = projects.slice(0, 3);
  const mobileItems = projects.slice(0, 2);

  return (
    <section aria-labelledby="proyectos-heading" className="container-site flex flex-col gap-3 pb-8 md:gap-6 md:pb-16">
      <div className="flex items-end justify-between gap-4">
        <h2 id="proyectos-heading">
          <span className="md:hidden">Proyectos en obra</span>
          <span className="hidden md:inline">Proyectos y despachos en obra</span>
        </h2>
      </div>

      {/* Móvil: 2 cards horizontales */}
      <div className="flex flex-col gap-3 md:hidden">
        {mobileItems.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="horizontal" />
        ))}
      </div>

      {/* Desktop: 3 cards 16:9 */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {desktopItems.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="vertical" />
        ))}
      </div>
    </section>
  );
}
