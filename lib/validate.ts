import type { z } from "zod";
import {
  bannerSchema,
  brandSchema,
  categorySchema,
  faqSchema,
  productSchema,
  projectSchema,
  siteSchema,
  systemSchema,
  TIPOS,
  TIPOS_SIN_CAPACIDAD,
  type Banner,
  type Brand,
  type Category,
  type Faq,
  type Product,
  type Project,
  type Site,
  type SystemTexts,
} from "@/lib/schemas";

/**
 * Validación de contenido en dos niveles:
 * 1. parseContent: schema de cada registro + reglas entre archivos. Puro, sin fs:
 *    lo usan los loaders (lib/content.ts) y el script de build.
 * 2. checkFiles / checkPlaceholders: solo en scripts/validate-content.ts (prebuild),
 *    porque en Vercel las funciones no ven public/ en disco.
 */

export type RawContent = {
  products: unknown;
  categories: unknown;
  brands: unknown;
  site: unknown;
  faq: unknown;
  system: unknown;
  projects: unknown;
  banners?: unknown;
};

export type Content = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  site: Site;
  faq: Faq;
  system: SystemTexts;
  projects: Project[];
  banners: Banner[];
};

export type Result = { content: Content | null; errors: string[]; warnings: string[] };

function formatIssues(file: string, error: z.ZodError, label?: (index: number) => string): string[] {
  return error.issues.map((issue) => {
    const [first, ...rest] = issue.path;
    const where =
      typeof first === "number" && label
        ? `${label(first)}${rest.length ? "." + rest.join(".") : ""}`
        : issue.path.join(".");
    return `${file} › ${where || "(raíz)"}: ${issue.message}`;
  });
}

/** Etiqueta legible de un registro: su slug si lo tiene, si no su índice. */
const labelFrom = (raw: unknown) => (i: number) => {
  const item = Array.isArray(raw) ? raw[i] : undefined;
  const s =
    item && typeof item === "object"
      ? "slug" in item
        ? String(item.slug)
        : "id" in item
          ? String(item.id)
          : ""
      : "";
  return s ? `[${s}]` : `[${i}]`;
};

function duplicates(values: string[]): string[] {
  return [...new Set(values.filter((v, i) => values.indexOf(v) !== i))];
}

export function parseContent(raw: RawContent): Result {
  const errors: string[] = [];
  const warnings: string[] = [];

  const products = productSchema.array().safeParse(raw.products);
  const categories = categorySchema.array().safeParse(raw.categories);
  const brands = brandSchema.array().safeParse(raw.brands);
  const site = siteSchema.safeParse(raw.site);
  const faq = faqSchema.safeParse(raw.faq);
  const system = systemSchema.safeParse(raw.system);
  const projects = projectSchema.array().safeParse(raw.projects ?? []);
  const banners = bannerSchema.array().safeParse(raw.banners ?? []);

  if (!products.success) errors.push(...formatIssues("products.json", products.error, labelFrom(raw.products)));
  if (!categories.success) errors.push(...formatIssues("categories.json", categories.error, labelFrom(raw.categories)));
  if (!brands.success) errors.push(...formatIssues("brands.json", brands.error, labelFrom(raw.brands)));
  if (!site.success) errors.push(...formatIssues("site.json", site.error));
  if (!faq.success) errors.push(...formatIssues("faq.json", faq.error, labelFrom(raw.faq)));
  if (!system.success) errors.push(...formatIssues("system.json", system.error));
  if (!projects.success) errors.push(...formatIssues("projects.json", projects.error, labelFrom(raw.projects)));
  if (!banners.success) errors.push(...formatIssues("banners.json", banners.error, labelFrom(raw.banners)));

  if (
    !products.success ||
    !categories.success ||
    !brands.success ||
    !site.success ||
    !faq.success ||
    !system.success ||
    !projects.success ||
    !banners.success
  ) {
    return { content: null, errors, warnings };
  }

  const content: Content = {
    products: products.data,
    categories: categories.data,
    brands: brands.data,
    site: site.data,
    faq: faq.data,
    system: system.data,
    projects: projects.data,
    banners: banners.data,
  };

  errors.push(...crossCheck(content, warnings));
  return { content: errors.length ? null : content, errors, warnings };
}

/** Reglas entre archivos. */
function crossCheck({ products, categories, brands, projects, banners }: Content, warnings: string[]): string[] {
  const errors: string[] = [];
  const e = (slug: string, msg: string) => errors.push(`products.json › [${slug}]: ${msg}`);

  for (const d of duplicates(products.map((p) => p.slug))) errors.push(`products.json: slug duplicado "${d}"`);
  for (const d of duplicates(categories.map((c) => c.slug))) errors.push(`categories.json: slug duplicado "${d}"`);
  for (const d of duplicates(brands.map((b) => b.slug))) errors.push(`brands.json: slug duplicado "${d}"`);
  for (const d of duplicates(projects.map((p) => p.slug))) errors.push(`projects.json: slug duplicado "${d}"`);
  for (const d of duplicates(banners.map((b) => b.id))) errors.push(`banners.json: id duplicado "${d}"`);

  const bySlug = new Map(products.map((p) => [p.slug, p]));

  for (const p of products) {
    if (!brands.some((b) => b.slug === p.marca)) e(p.slug, `marca "${p.marca}" no existe en brands.json`);

    const cat = categories.find((c) => c.slug === p.categoria);
    if (!cat) e(p.slug, `categoría "${p.categoria}" no existe en categories.json`);
    else if (!cat.tipos.includes(p.tipo)) e(p.slug, `la categoría "${cat.slug}" no agrupa el tipo "${p.tipo}"`);

    for (const ref of p.accesorios_opcionales) {
      const acc = bySlug.get(ref);
      if (!acc) e(p.slug, `accesorio opcional "${ref}" no existe`);
      else if (!TIPOS_SIN_CAPACIDAD.includes(acc.tipo)) e(p.slug, `"${ref}" no es un accesorio`);
      else if (p.publicado && !acc.publicado) e(p.slug, `accesorio opcional "${ref}" no está publicado`);
    }
  }

  // Familia: mismo tipo, marca y forma; capacidades sin repetir.
  const familias = Map.groupBy(
    products.filter((p) => p.familia),
    (p) => p.familia as string,
  );
  for (const [familia, miembros] of familias) {
    const [ref] = miembros;
    for (const m of miembros) {
      if (m.tipo !== ref.tipo || m.marca !== ref.marca || m.dimensiones?.forma !== ref.dimensiones?.forma)
        errors.push(`familia "${familia}": ${m.slug} no comparte tipo, marca y forma con ${ref.slug}`);
    }
    const caps = duplicates(miembros.map((m) => String(m.capacidad_l)));
    if (caps.length) errors.push(`familia "${familia}": capacidad repetida (${caps.join(", ")} L)`);
  }

  // "Ninguna sección vacía": una categoría sin productos publicados no rompe, pero avisa.
  for (const c of categories) {
    if (!products.some((p) => p.publicado && p.categoria === c.slug))
      warnings.push(`categories.json › [${c.slug}]: sin productos publicados (la página no se generará)`);
  }

  return errors;
}

/** Rutas en public/ que el contenido declara. Para checkFiles en el script de build. */
export function declaredFiles({ products, categories, brands, projects, banners }: Content): { owner: string; path: string }[] {
  const files: { owner: string; path: string }[] = [];
  for (const p of products) {
    const owner = `products.json › [${p.slug}]`;
    for (const c of p.certificaciones) files.push({ owner, path: c.documento });
    if (p.ficha_pdf) files.push({ owner, path: p.ficha_pdf });
    if (p.plano_svg) files.push({ owner, path: p.plano_svg });
    if (p.og_image) files.push({ owner, path: p.og_image });
    if (p.imagen_principal) files.push({ owner, path: p.imagen_principal });
    if (p.imagen_medidas) files.push({ owner, path: p.imagen_medidas });
    if (p.imagen_densidades) files.push({ owner, path: p.imagen_densidades });
    for (const f of p.galeria) files.push({ owner, path: f.src });
  }
  for (const c of categories) if (c.imagen) files.push({ owner: `categories.json › [${c.slug}]`, path: c.imagen });
  for (const b of brands) if (b.logo) files.push({ owner: `brands.json › [${b.slug}]`, path: b.logo });
  for (const pr of projects) if (pr.foto) files.push({ owner: `projects.json › [${pr.slug}]`, path: pr.foto.src });
  for (const bn of banners) {
    if (!bn.activo) continue;
    const owner = `banners.json › [${bn.id}]`;
    if (bn.tipo === "slide") {
      files.push({ owner, path: bn.imagen.src });
    } else {
      files.push({ owner, path: bn.imagen_desktop });
      if (bn.imagen_mobile) files.push({ owner, path: bn.imagen_mobile });
    }
  }
  return files;
}

/** En producción (modo_demo: false), un "{{" en cualquier texto rompe el build. */
export function findPlaceholders(value: unknown, path = ""): string[] {
  if (typeof value === "string") return value.includes("{{") ? [path || "(raíz)"] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => findPlaceholders(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => findPlaceholders(v, path ? `${path}.${k}` : k));
  return [];
}
