/**
 * Validación de contenido previa al build (npm run validate, se ejecuta en prebuild).
 * 1. Schema zod + reglas entre archivos de content/*.json
 * 2. Archivos declarados (fichas, planos, certificados, fotos) existen en public/
 * 3. Producción (modo_demo: false): ningún "{{" en el contenido
 * 4. Los fixtures máximo y mínimo (content/__fixtures__/) validan contra el mismo schema
 * Sale con código 1 si hay errores: el build no continúa.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { declaredFiles, findPlaceholders, parseContent, type RawContent } from "@/lib/validate";

const root = process.cwd();
const read = (file: string): unknown => JSON.parse(readFileSync(join(root, "content", file), "utf8"));

const raw: RawContent = {
  products: read("products.json"),
  categories: read("categories.json"),
  brands: read("brands.json"),
  site: read("site.json"),
  faq: read("faq.json"),
  system: read("system.json"),
  projects: read("projects.json"),
  banners: read("banners.json"),
};

const errors: string[] = [];
const warnings: string[] = [];

// 1. Contenido real
const result = parseContent(raw);
errors.push(...result.errors);
warnings.push(...result.warnings);

if (result.content) {
  // 2. Archivos en public/
  for (const { owner, path } of declaredFiles(result.content)) {
    if (!existsSync(join(root, "public", path))) errors.push(`${owner}: no existe public${path}`);
  }

  // 3. Placeholders en producción
  if (!result.content.site.modo_demo) {
    for (const [file, data] of Object.entries(raw)) {
      for (const path of findPlaceholders(data)) errors.push(`${file}.json › ${path}: contiene "{{" (placeholder sin reemplazar)`);
    }
  }
}

// 4. Fixtures: mismo schema y reglas, sin comprobar archivos (son datos de prueba).
const fixtures = parseContent({ ...raw, products: read("__fixtures__/products.json") });
errors.push(...fixtures.errors.map((e) => `[fixture] ${e}`));

// ─── Reporte ──────────────────────────────────────────────────────────
const productos = result.content?.products.filter((p) => p.publicado).length ?? 0;
console.log(`\nValidación de contenido · ${productos} productos publicados`);
for (const w of warnings) console.log(`  aviso  ${w}`);
for (const e of errors) console.log(`  ERROR  ${e}`);

if (errors.length) {
  console.log(`\n✗ ${errors.length} errores. Corrige content/ antes de construir.\n`);
  process.exit(1);
}
console.log(`✓ Contenido válido${warnings.length ? ` (${warnings.length} avisos)` : ""}\n`);
