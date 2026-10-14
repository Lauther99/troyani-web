import siteJson from "@/content/site.json";
import type { Site } from "@/lib/schemas";

/**
 * Datos del sitio para componentes cliente (Header, menú). Import de tipo:
 * zod no entra al bundle del navegador. La validación real corre en el
 * prebuild (scripts/validate-content.ts) y en los loaders de servidor (lib/content.ts).
 */
export const site = siteJson as Site;
