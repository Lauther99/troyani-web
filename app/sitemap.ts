import type { MetadataRoute } from "next";
import { getCategories, getProducts, getSite } from "@/lib/content";

// Rutas de la fase 1A + categorías y productos publicados. Las rutas de 1B se agregan al construirse.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${getSite().dominio}`;
  const estaticas = ["/", "/catalogo/", "/contacto/", "/nosotros/", "/preguntas-frecuentes/"];
  return [
    ...estaticas.map((path) => ({ url: `${base}${path}` })),
    ...getCategories().map((c) => ({ url: `${base}/catalogo/${c.slug}/` })),
    ...getProducts().map((p) => ({ url: `${base}/productos/${p.slug}/` })),
  ];
}
