import productsJson from "@/content/products.json";
import categoriesJson from "@/content/categories.json";
import brandsJson from "@/content/brands.json";
import siteJson from "@/content/site.json";
import faqJson from "@/content/faq.json";
import systemJson from "@/content/system.json";
import projectsJson from "@/content/projects.json";
import bannersJson from "@/content/banners.json";
import { parseContent, type Content } from "@/lib/validate";
import type { Banner, Brand, Category, Product, Project } from "@/lib/schemas";

/**
 * Loaders de contenido (solo servidor). En fase 1 la fuente es content/*.json;
 * si mañana es un CMS o una base de datos, solo cambia este archivo.
 * Si el contenido no valida, la página no se genera: el build falla con la lista de errores.
 */

let cache: Content | null = null;

function load(): Content {
  if (cache) return cache;
  const { content, errors } = parseContent({
    products: productsJson,
    categories: categoriesJson,
    brands: brandsJson,
    site: siteJson,
    faq: faqJson,
    system: systemJson,
    projects: projectsJson,
    banners: bannersJson,
  });
  if (!content) {
    throw new Error(`Contenido inválido (${errors.length} errores):\n  ${errors.join("\n  ")}`);
  }
  cache = content;
  return content;
}

// ─── Productos ────────────────────────────────────────────────────────

/** Productos publicados, ordenados por capacidad ascendente (los accesorios al final). */
export function getProducts(): Product[] {
  return load()
    .products.filter((p) => p.publicado)
    .sort((a, b) => (a.capacidad_l ?? Infinity) - (b.capacidad_l ?? Infinity));
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

/** Litrajes hermanos publicados (incluye al propio producto), por capacidad. */
export function getFamilia(product: Product): Product[] {
  if (!product.familia) return [product];
  return getProducts().filter((p) => p.familia === product.familia);
}

export function getDestacados(limit = 4): Product[] {
  const publicados = getProducts();
  const populares = publicados.filter((p) => p.mas_popular || p.destacado);
  return populares.slice(0, limit);
}

/**
 * Relacionados (wireframe pág. 11, anti-dispersión):
 * - un tanque muestra sus accesorios opcionales, nunca otros tanques;
 * - un accesorio muestra los productos compatibles con su compatible_con.
 */
export function getRelacionados(product: Product): Product[] {
  const publicados = getProducts();
  if (product.capacidad_l !== null) {
    return publicados.filter((p) => product.accesorios_opcionales.includes(p.slug));
  }
  const max = product.compatible_con?.capacidad_max_l;
  if (max === undefined) return [];
  return publicados.filter(
    (p) => p.capacidad_l !== null && (max === null || p.capacidad_l <= max) && p.accesorios_opcionales.includes(product.slug),
  );
}

// ─── Categorías, marcas, sitio, proyectos ─────────────────────────────

/** Categorías con al menos un producto publicado, en su orden. */
export function getCategories(): Category[] {
  const publicados = getProducts();
  return load()
    .categories.filter((c) => publicados.some((p) => p.categoria === c.slug))
    .sort((a, b) => a.orden - b.orden);
}

export function getCategory(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return getProducts().filter((p) => p.categoria === slug);
}

export function getBrands(): Brand[] {
  return load().brands;
}

export function getBrand(slug: string): Brand | undefined {
  return load().brands.find((b) => b.slug === slug);
}

/** Datos del sitio con datos_confianza filtrados: un dato sin fuente no se publica. */
export function getSite() {
  const site = load().site;
  return { ...site, datos_confianza: site.datos_confianza.filter((d) => d.fuente.trim() !== "") };
}

/** Proyectos con permiso escrito para publicar, del más reciente al más antiguo. */
export function getProjects(): Project[] {
  return load()
    .projects.filter((p) => p.permiso_publicar)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function getFaq() {
  return load().faq;
}

export function getSystemTexts() {
  return load().system;
}

/** Banners activos del Hero ordenados por su campo orden. */
export function getBanners(): Banner[] {
  return load()
    .banners.filter((b) => b.activo)
    .sort((a, b) => a.orden - b.orden);
}

