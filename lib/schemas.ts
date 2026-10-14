import { z } from "zod";

// Mensajes de error de zod en español.
z.config(z.locales.es());

/**
 * Modelo de contenido actualizado por línea de producto (Hogar y Agroindustria):
 * - 12 categorías oficiales divididas en `linea: "hogar" | "agroindustria"`.
 * - Productos estructurados por línea con soporte para tablas de capacidades,
 *   variantes de color/garantía, modelos (bombas, purificadores, termas) y accesorios Banjo.
 */

// ─── Helpers ──────────────────────────────────────────────────────────

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug: solo minúsculas, números y guiones");
const fecha = z.iso.date(); // "2026-10-01"
const rutaPublica = z.string().startsWith("/", "ruta pública: debe empezar con /");
const palabras = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const maxPalabras = (n: number) =>
  z.string().refine((s) => palabras(s) <= n, { message: `máximo ${n} palabras` });

const rangoPalabras = (min: number, max: number) =>
  z.string().refine((s) => {
    const n = palabras(s);
    return n >= min && n <= max;
  }, { message: `entre ${min} y ${max} palabras` });

// ─── Enums ────────────────────────────────────────────────────────────

export const LINEAS = ["hogar", "agroindustria"] as const;
export const TIPOS = [
  "tanque",
  "cisterna",
  "biodigestor",
  "tolva",
  "nodriza",
  "bomba",
  "purificador",
  "terma",
  "accesorio",
  "dosificador",
] as const;
export const USOS = ["agua", "quimicos", "agro", "saneamiento"] as const;
export const FORMAS = ["cilindrica_vertical", "cilindrica_horizontal", "rectangular", "conica"] as const;
export const GRADOS = ["estandar", "reforzado", "extra"] as const;

export type Linea = (typeof LINEAS)[number];
export type Tipo = (typeof TIPOS)[number];
export type Uso = (typeof USOS)[number];
export type Grado = (typeof GRADOS)[number];

/** Tipos sin capacidad en litros: se miden por medida nominal o modelos. */
export const TIPOS_SIN_CAPACIDAD: readonly Tipo[] = ["accesorio", "dosificador", "bomba", "purificador", "terma"];
export const tieneCapacidad = (tipo: Tipo) => !TIPOS_SIN_CAPACIDAD.includes(tipo);

// ─── Producto ─────────────────────────────────────────────────────────

const dimensionesSchema = z.object({
  forma: z.enum(FORMAS),
  diametro_cm: z.number().positive().nullable(),
  largo_cm: z.number().positive().nullable(),
  ancho_cm: z.number().positive().nullable(),
  alto_cm: z.number().positive().nullable(),
  peso_vacio_kg: z.number().positive().nullable(),
});

const gradoSchema = z.object({
  nivel: z.enum(GRADOS),
  gravedad_especifica_max: z.number().min(1).max(2.5),
  espesor_pared_mm: z.number().positive().nullable().optional(),
});

const certificacionSchema = z.object({
  nombre: z.string().min(1),
  entidad: z.string().min(1),
  documento: rutaPublica.regex(/^\/certificados\/.+\.pdf$/, "debe estar en /certificados/*.pdf"),
});

const compatibilidadSchema = z.object({
  sustancia: z.string().min(1),
  concentracion_max_pct: z.number().min(0).max(100),
  temperatura_max_c: z.number().nullable(),
  estado: z.enum(["compatible", "restriccion", "no_compatible"]),
  nota: z.string(),
});

const capacidadItemSchema = z.object({
  nombre: z.string().optional(),
  color: z.string().optional(),
  capacidad_l: z.number().int().positive(),
  altura_cm: z.number().positive().optional(),
  diametro_cm: z.number().positive().optional(),
  largo_cm: z.number().positive().optional(),
  altura_m: z.number().positive().optional(),
  diametro_m: z.number().positive().optional(),
  largo_m: z.number().positive().optional(),
  peso_kg: z.number().positive().optional(),
  tolerancia_cm: z.string().optional(),
  garantia: z.string().optional(),
  accesorios_incluidos: z.array(z.string()).optional(),
  cotas: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
});

const varianteSchema = z.object({
  color: z.string().min(1),
  garantia: z.string().optional(),
  imagen: rutaPublica.optional(),
  capacidades: z.array(capacidadItemSchema).min(1),
});

const modeloItemSchema = z.object({
  nombre: z.string().min(1),
  modelo: z.string().optional(),
  potencia_hp: z.string().optional(),
  descripcion: z.string().optional(),
  imagen: rutaPublica.optional(),
  especificaciones: z.record(z.string(), z.union([z.number(), z.string()])).nullable().optional(),
});

const accesorioBanjoItemSchema = z.object({
  nombre: z.string().min(1),
  funcion: z.string().optional(),
  medidas_comercializadas: z.union([z.string(), z.array(z.string()), z.record(z.string(), z.array(z.string()))]).optional(),
  material: z.string().optional(),
  presion_max: z.string().optional(),
  garantia: z.string().optional(),
  especificaciones: z.string().optional(),
  imagen: rutaPublica.optional(),
});

const accesoriosDetalleSchema = z.object({
  incluidos: z.boolean(),
  nota: z.string().optional(),
  imagen: rutaPublica.optional(),
  imagen_complementarios: rutaPublica.optional(),
  items: z.array(z.string()).default([]),
  complementarios: z.array(z.string()).optional(),
});

// Unión discriminada: el modo fijo exige precio > 0, IGV incluido y fecha.
// "cotizacion" incluye `cotizacion: true` para ocultar el monto en la interfaz.
const precioSchema = z.discriminatedUnion("modo", [
  z.object({
    modo: z.literal("fijo"),
    cotizacion: z.boolean().default(false),
    pen: z.number().positive(),
    incluye_igv: z.literal(true),
    actualizado: fecha,
    escala_volumen: z
      .array(z.object({ desde_und: z.number().int().min(2), pen_unitario: z.number().positive() }))
      .default([]),
  }),
  z.object({
    modo: z.literal("cotizacion"),
    cotizacion: z.boolean().default(true),
    pen: z.number().nullable().optional(),
    incluye_igv: z.boolean().optional(),
  }),
]);

const disponibilidadSchema = z.object({
  estado: z.enum(["stock", "a_pedido", "consultar"]),
  almacen: z.string().nullable(),
  dias_entrega: z.number().int().positive().nullable(),
  actualizado: fecha,
});

const fotoSchema = z.object({
  src: rutaPublica,
  alt: z.string().min(1).max(125),
  tipo: z.enum(["tecnica", "uso", "detalle"]),
});

export const productSchema = z
  .object({
    slug,
    sku: z.string().min(1),
    tipo: z.enum(TIPOS),
    linea: z.enum(LINEAS),
    categoria: slug,
    usos: z.array(z.enum(USOS)).min(1),
    familia: slug.nullable().default(null),
    marca: slug,
    nombre: z.string().min(1),
    subtitulo: z.string().optional(),
    resumen: z.string().min(1).max(200),
    descripcion: z.array(z.string().min(1)).min(1).max(5),
    beneficios: z.array(z.string().min(1)).default([]),
    aplicaciones: z.array(z.string().min(1)).optional(),
    capacidad_l: z.number().int().positive().nullable(),
    medida_nominal: z.string().min(1).nullable(),
    dimensiones: dimensionesSchema.nullable(),
    capacidades: z.array(capacidadItemSchema).default([]),
    variantes: z.array(varianteSchema).optional(),
    modelos: z.array(modeloItemSchema).optional(),
    items_accesorios: z.array(accesorioBanjoItemSchema).optional(),
    grados_densidad: z
      .array(z.object({ densidad_kg_l: z.string(), tipo_tanque: z.string() }))
      .optional(),
    grado: gradoSchema.nullable(),
    material: z.string().min(1),
    certificaciones: z.array(certificacionSchema).default([]),
    compatibilidad_quimica: z.array(compatibilidadSchema).default([]),
    accesorios: accesoriosDetalleSchema.optional(),
    accesorios_incluidos: z
      .array(z.object({ nombre: z.string().min(1), cantidad: z.number().int().positive() }))
      .default([]),
    accesorios_opcionales: z.array(slug).default([]),
    compatible_con: z.object({ capacidad_max_l: z.number().int().positive().nullable() }).nullable(),
    instalacion: z
      .object({
        base: z.string().min(1).nullable(),
        transporte: z.string().min(1).nullable(),
        restricciones: z.array(z.string().min(1)).default([]),
      })
      .nullable(),
    precio: precioSchema,
    flete: z.enum(["incluido_lima", "cotizar"]).default("cotizar"),
    disponibilidad: disponibilidadSchema,
    garantia: z.union([z.string(), z.number()]).nullable().optional(),
    garantia_anios: z.number().int().min(0),
    ficha_pdf: rutaPublica.regex(/^\/fichas\/.+\.pdf$/, "debe estar en /fichas/*.pdf").nullable(),
    plano_svg: rutaPublica.regex(/^\/planos\/.+\.svg$/, "debe estar en /planos/*.svg").nullable(),
    imagen_principal: rutaPublica.optional(),
    imagen_medidas: rutaPublica.nullable().optional(),
    imagen_densidades: rutaPublica.nullable().optional(),
    galeria: z.array(fotoSchema).min(1),
    og_image: rutaPublica.nullable(),
    url_legacy: z.url().optional(),
    destacado: z.boolean(),
    mas_popular: z.boolean().default(false),
    publicado: z.boolean(),
  })
  .superRefine((p, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });

    if (!p.galeria.some((f) => f.tipo === "tecnica")) issue(["galeria"], "al menos una foto de tipo tecnica");

    // Escala por volumen: solo con precio fijo, cantidades crecientes y precios decrecientes.
    if (p.precio.modo === "fijo") {
      const { pen, escala_volumen: escala } = p.precio;
      escala.forEach((e, i) => {
        if (e.pen_unitario >= pen)
          issue(["precio", "escala_volumen", i], "el precio por volumen debe ser menor al precio unitario");
        if (i > 0 && e.desde_und <= escala[i - 1].desde_und)
          issue(["precio", "escala_volumen", i], "desde_und debe ser creciente");
      });
    }

    if (p.disponibilidad.estado === "a_pedido" && !p.disponibilidad.dias_entrega)
      issue(["disponibilidad", "dias_entrega"], "a_pedido exige dias_entrega");
    if (p.disponibilidad.estado === "stock" && !p.disponibilidad.almacen)
      issue(["disponibilidad", "almacen"], "stock exige almacen");
  });

export type Product = z.infer<typeof productSchema>;
export type CapacidadItem = z.infer<typeof capacidadItemSchema>;
export type Precio = Product["precio"];
export type Disponibilidad = Product["disponibilidad"];

// ─── Marca ────────────────────────────────────────────────────────────

export const brandSchema = z.object({
  slug,
  nombre: z.string().min(1),
  logo: rutaPublica.regex(/^\/brands\/.+\.svg$/, "debe estar en /brands/*.svg").nullable(),
  logo_autorizado: z.boolean(),
  garantia_texto: z.string(),
});

export type Brand = z.infer<typeof brandSchema>;

// ─── Categoría ────────────────────────────────────────────────────────

export const categorySchema = z.object({
  slug,
  nombre: z.string().min(1),
  linea: z.enum(LINEAS),
  tipos: z.array(z.enum(TIPOS)).min(1),
  imagen: rutaPublica.optional(),
  h1: z.string().min(1),
  intro: maxPalabras(25),
  texto_seo: rangoPalabras(70, 130),
  orden: z.number().int().positive(),
  meta: z.object({
    title: z.string().min(1).max(65),
    description: z.string().min(1).max(160),
  }),
});

export type Category = z.infer<typeof categorySchema>;

// ─── Sitio ────────────────────────────────────────────────────────────

export const siteSchema = z.object({
  modo_demo: z.boolean(),
  nombre_comercial: z.string().min(1),
  dominio: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, "dominio sin protocolo, p. ej. troyani.com"),
  razon_social: z.string(),
  contacto_nombre: z.string().optional(),
  ruc: z.string().regex(/^(\d{11})?$/, "RUC: 11 dígitos o vacío"),
  whatsapp_e164: z.string().regex(/^51\d{9}$/, "51 + 9 dígitos"),
  whatsapp_secundario: z.string().regex(/^51\d{9}$/, "51 + 9 dígitos").optional(),
  telefono: z.string().regex(/^51\d{9}$/, "51 + 9 dígitos"),
  telefono_secundario: z.string().regex(/^51\d{9}$/, "51 + 9 dígitos").optional(),
  correo_ventas: z.email().or(z.literal("")),
  almacenes: z
    .array(
      z.object({
        ciudad: z.string().min(1),
        direccion: z.string(),
        horario: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
    )
    .min(1),
  datos_confianza: z.array(
    z.object({
      valor: z.string().min(1),
      etiqueta: z.string().min(1),
      fuente: z.string(),
      icono: z.enum(["experiencia", "almacen", "despacho", "distribuidor"]).optional(),
    }),
  ),
  respuesta_horas: z.number().positive(),
  redes: z.array(z.object({ nombre: z.string().min(1), url: z.url() })),
});

export type Site = z.infer<typeof siteSchema>;

// ─── Proyectos (wireframe págs. 6 y 14) ───────────────────────────────

export const projectSchema = z.object({
  slug,
  cliente: z.string().min(1),
  sector: z.string().min(1),
  region: z.string().min(1),
  fecha: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "fecha: AAAA-MM"),
  permiso_publicar: z.boolean(),
  foto: z.object({ src: rutaPublica, alt: z.string().min(1).max(125) }).nullable(),
  items: z
    .array(z.object({ capacidad_l: z.number().int().positive(), cantidad: z.number().int().positive() }))
    .min(1),
});

export type Project = z.infer<typeof projectSchema>;

// ─── Preguntas frecuentes ─────────────────────────────────────────────

export const faqSchema = z.array(
  z.object({
    slug,
    grupo: z.string().min(1),
    preguntas: z
      .array(z.object({ pregunta: z.string().min(1), respuesta: z.string().min(1) }))
      .min(4)
      .max(6),
  }),
);

export type Faq = z.infer<typeof faqSchema>;

// ─── Textos de sistema (wireframe pág. 18) ───────────────────────────

export const systemSchema = z.object({
  precio: z.object({ cotizacion: z.string(), inc_igv: z.string() }),
  disponibilidad: z.object({ stock: z.string(), a_pedido: z.string(), consultar: z.string() }),
  whatsapp: z.object({
    generico: z.string(),
    contacto: z.string(),
    no_encontrado: z.string(),
    catalogo_vacio: z.string(),
    cotizar_producto: z.string(),
  }),
});

export type SystemTexts = z.infer<typeof systemSchema>;

// ─── Banners y Carrusel del Hero ─────────────────────────────────────

export const bannerSchema = z.discriminatedUnion("tipo", [
  z.object({
    id: slug,
    tipo: z.literal("slide"),
    etiqueta: z.string().min(1),
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    mostrar_selector_capacidad: z.boolean().default(false),
    highlights: z.array(z.string().min(1)).default([]),
    cta_primario: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
    cta_secundario: z
      .object({
        label: z.string().min(1),
        href: z.string().optional(),
        whatsapp: z.boolean().default(false),
      })
      .optional(),
    imagen: z.object({
      src: rutaPublica,
      alt: z.string().min(1).max(125),
    }),
    activo: z.boolean().default(true),
    orden: z.number().int().positive(),
  }),
  z.object({
    id: slug,
    tipo: z.literal("poster"),
    titulo: z.string().min(1),
    subtitulo: z.string().optional(),
    imagen_desktop: rutaPublica,
    imagen_mobile: rutaPublica.nullable().default(null),
    cta_label: z.string().default("Cotizar ahora"),
    href: z.string().min(1),
    whatsapp: z.boolean().default(false),
    activo: z.boolean().default(true),
    orden: z.number().int().positive(),
  }),
]);

export type Banner = z.infer<typeof bannerSchema>;

