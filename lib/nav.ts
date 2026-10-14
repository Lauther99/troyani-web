/**
 * Navegación del sitio, fase 1A.
 * Soluciones industriales y Proyectos entran en 1B; Contacto vive en el footer y el CTA.
 */
export type NavLink = { href: string; label: string };

export const mainNav: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo/", label: "Catálogo" },
  { href: "/nosotros/", label: "Nosotros" },
];

export const companyNav: NavLink[] = [
  { href: "/nosotros/", label: "Nosotros" },
  { href: "/contacto/", label: "Contacto" },
];

/** Activo si la ruta coincide o es hija (p. ej. /catalogo/tanques/ activa Catálogo; / solo activa Inicio). */
export function isActive(pathname: string, href: string): boolean {
  const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  const normPath = norm(pathname);
  const normHref = norm(href);
  if (normHref === "/") {
    return normPath === "/";
  }
  return normPath.startsWith(normHref);
}
