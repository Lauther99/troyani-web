import Image from "next/image";
import Link from "next/link";
import { formatTelefono } from "@/lib/format";
import { getCategories, getSite } from "@/lib/content";

export default function Footer() {
  const site = getSite();
  const almacen = site.almacenes[0];
  const categories = getCategories();
  const year = new Date().getFullYear();

  const categoriasHogar = categories.filter((c) => c.linea === "hogar");
  const categoriasAgro = categories.filter((c) => c.linea === "agroindustria");

  const tel1 = site.telefono || "51945226958";
  const tel2 = site.telefono_secundario || "51985134004";

  const waUrl1 = `https://wa.me/${site.whatsapp_e164 || tel1}?text=${encodeURIComponent(
    "Hola Silvana, quiero cotizar con Troyani Inversiones."
  )}`;
  const waUrl2 = `https://wa.me/${site.whatsapp_secundario || tel2}?text=${encodeURIComponent(
    "Hola, quiero cotizar con Troyani Inversiones."
  )}`;

  return (
    <footer className="bg-primary text-text-nav border-t border-surface/10">
      <div className="container-site py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Columna 1: Identidad & Datos de Contacto (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 text-caption">
            <Link href="/" className="self-start">
              <Image
                src="/brand/logo-troyani-blanco.webp"
                alt="Troyani Inversiones"
                width={857}
                height={244}
                className="h-10 w-auto"
              />
            </Link>

            <p className="text-sm text-text-nav/90 leading-relaxed">
              Distribuidor autorizado <strong className="text-surface font-semibold">Rotoplas</strong> y <strong className="text-surface font-semibold">Banjo</strong> en Perú. Venta especializada de tanques de polietileno, cisternas, biodigestores, bombas y accesorios industriales.
            </p>

            <div className="flex flex-col gap-2.5 pt-2 border-t border-surface/10">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-wider text-surface/60 font-medium">
                  Atención Comercial & Proyectos
                </span>
                <span className="text-sm font-semibold text-surface">
                  {site.contacto_nombre || "Silvana Troyani"}
                </span>
              </div>

              {/* Teléfonos con accesos a llamada y WhatsApp */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:+${tel1}`}
                    className="tabular-nums font-mono text-xs text-surface hover:text-[#f5b82e] transition-colors"
                  >
                    {formatTelefono(tel1)}
                  </a>
                  <a
                    href={waUrl1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] bg-[#1f7a4b]/20 hover:bg-[#1f7a4b]/40 text-[#2fa36b] px-2 py-0.5 rounded-full font-medium transition-colors"
                  >
                    WhatsApp 1
                  </a>
                </div>

                {tel2 && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:+${tel2}`}
                      className="tabular-nums font-mono text-xs text-surface hover:text-[#f5b82e] transition-colors"
                    >
                      {formatTelefono(tel2)}
                    </a>
                    <a
                      href={waUrl2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] bg-[#1f7a4b]/20 hover:bg-[#1f7a4b]/40 text-[#2fa36b] px-2 py-0.5 rounded-full font-medium transition-colors"
                    >
                      WhatsApp 2
                    </a>
                  </div>
                )}
              </div>

              {site.correo_ventas && (
                <a
                  href={`mailto:${site.correo_ventas}`}
                  className="text-xs hover:text-surface pt-1 transition-colors break-all"
                >
                  {site.correo_ventas}
                </a>
              )}

              {almacen?.horario && (
                <span className="text-xs text-text-nav/75">
                  Horario: {almacen.horario}
                </span>
              )}
            </div>
          </div>

          {/* Columna 2: Línea Hogar (2 cols) */}
          <div className="lg:col-span-2">
            <p className="mb-3.5 font-display text-sm font-bold uppercase tracking-wider text-surface">
              Línea Hogar
            </p>
            <ul className="flex flex-col gap-1.5 text-xs md:text-sm">
              {categoriasHogar.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalogo/${cat.slug}/`}
                    className="text-text-nav hover:text-surface transition-colors py-0.5 inline-block"
                  >
                    {cat.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Línea Agroindustria (3 cols) */}
          <div className="lg:col-span-3">
            <p className="mb-3.5 font-display text-sm font-bold uppercase tracking-wider text-surface">
              Línea Agroindustria
            </p>
            <ul className="flex flex-col gap-1.5 text-xs md:text-sm">
              {categoriasAgro.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalogo/${cat.slug}/`}
                    className="text-text-nav hover:text-surface transition-colors py-0.5 inline-block"
                  >
                    {cat.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Empresa & Cotización Rápida (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div>
              <p className="mb-3.5 font-display text-sm font-bold uppercase tracking-wider text-surface">
                Empresa
              </p>
              <ul className="flex flex-col gap-1.5 text-xs md:text-sm">
                <li>
                  <Link
                    href="/nosotros/"
                    className="text-text-nav hover:text-surface transition-colors py-0.5 inline-block"
                  >
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogo/"
                    className="text-text-nav hover:text-surface transition-colors py-0.5 inline-block"
                  >
                    Catálogo General
                  </Link>
                </li>
                <li>
                  <Link
                    href="/soluciones-industriales/"
                    className="text-text-nav hover:text-surface transition-colors py-0.5 inline-block"
                  >
                    Soluciones Industriales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/preguntas-frecuentes/"
                    className="text-text-nav hover:text-surface transition-colors py-0.5 inline-block"
                  >
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto/"
                    className="text-text-nav hover:text-surface transition-colors py-0.5 inline-block"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Caja de Cotización con ambos números disponibles */}
            <div className="p-4 rounded-2xl bg-surface/5 border border-surface/10 flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold text-surface">
                  ¿Necesitas cotizar?
                </span>
                <span className="text-[11px] text-text-nav/80 leading-snug">
                  Respondemos en menos de {site.respuesta_horas} h hábiles con precios oficiales en S/ con IGV.
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={waUrl1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 h-10 px-3.5 rounded-xl bg-[#f5b82e] hover:bg-[#ffc640] text-[#0e1f2e] font-semibold text-xs transition-colors shadow-sm"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z"
                        stroke="#0e1f2e"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.2 9.3c.3 1.6 1.9 3.3 3.6 3.8l1-1 1.7.7-.4 1.5c-2.9.2-6.2-3-6-6l1.5-.4.7 1.7-1 1Z"
                        fill="#0e1f2e"
                      />
                    </svg>
                    WhatsApp
                  </span>
                </a>

                {tel2 && (
                  <a
                    href={waUrl2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 h-9 px-3 rounded-xl border border-surface/20 hover:border-surface/50 text-surface text-xs font-medium transition-colors"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z"
                          stroke="#2fa36b"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.2 9.3c.3 1.6 1.9 3.3 3.6 3.8l1-1 1.7.7-.4 1.5c-2.9.2-6.2-3-6-6l1.5-.4.7 1.7-1 1Z"
                          fill="#2fa36b"
                        />
                      </svg>
                      Línea Ventas
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Copyright y Legal */}
      <div className="border-t border-surface/10">
        <div className="container-site flex flex-col gap-2 py-5 text-caption sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.razon_social || site.nombre_comercial} · Distribuidor Autorizado Rotoplas & Banjo en Perú
          </p>
          {site.redes.length > 0 && (
            <ul className="flex gap-4">
              {site.redes.map((red) => (
                <li key={red.url}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-surface transition-colors"
                  >
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
