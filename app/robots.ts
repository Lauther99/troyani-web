import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

// La demo no se indexa: sus precios y stock son de referencia.
export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  if (site.modo_demo) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${site.dominio}/sitemap.xml`,
  };
}
