"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { site } from "@/lib/site";

const PHONES = [
  { raw: "51945226958", display: "945 226 958", label: "Celular · WhatsApp (Principal)", desc: "Silvana Troyani" },
  { raw: "51985134004", display: "985 134 004", label: "Celular · WhatsApp (Secundario)", desc: "Atención comercial" },
];

const LINEAS = ["Línea Hogar", "Línea Agroindustria", "Asesoría"] as const;
type LineaType = (typeof LINEAS)[number];

const PRODUCTOS: Record<LineaType, string[]> = {
  "Línea Hogar": [
    "Tanques para agua",
    "Cisternas",
    "Biodigestores",
    "Bombas",
    "Filtros y purificadores",
    "Termas",
  ],
  "Línea Agroindustria": [
    "Tanques industriales",
    "Tanques para pisco y vino",
    "Tolvas",
    "Cisterna industrial",
    "Nodriza industrial",
    "Accesorios Banjo – USA",
  ],
  "Asesoría": [
    "Aún no estoy seguro · Quiero que me recomienden",
    "Elegir el grado según mi químico",
    "Cotización para un proyecto grande",
  ],
};

const emailOk = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default function ContactClient() {
  const rootRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    tel: "",
    linea: "Asesoría" as LineaType,
    producto: PRODUCTOS["Asesoría"][0],
    mensaje: "",
  });

  const [selectedPhone, setSelectedPhone] = useState(PHONES[0]);
  const [touched, setTouched] = useState({ nombre: false, correo: false });
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Entrance animations on load
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ease = "cubic-bezier(.16,1,.3,1)";
    root.querySelectorAll<HTMLElement>("[data-line]").forEach((el) => {
      const idx = Number(el.dataset.line || 0);
      el.animate(
        [{ transform: "translateY(105%)" }, { transform: "none" }],
        { duration: 1100, delay: 100 + idx * 110, easing: ease, fill: "backwards" }
      );
    });

    root.querySelectorAll<HTMLElement>("[data-rv]").forEach((el) => {
      const idx = Number(el.dataset.rv || 0);
      el.animate(
        [{ opacity: 0, transform: "translateY(26px)" }, { opacity: 1, transform: "none" }],
        { duration: 1000, delay: 200 + idx * 120, easing: ease, fill: "backwards" }
      );
    });
  }, []);

  const setField = (k: keyof typeof form, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setSent(false);
  };

  const copyEmail = () => {
    const email = site.correo_ventas || "stroyani@troyaniinversiones.com";
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const nombreErr = (touched.nombre || tried) && !form.nombre.trim();
  const correoErr = (touched.correo || tried) && !emailOk(form.correo.trim());

  const buildMessage = () => {
    const lines: string[] = [];
    lines.push(`Hola, soy ${form.nombre.trim() || "[tu nombre]"}.`);
    lines.push(
      form.linea === "Asesoría"
        ? `Necesito: ${form.producto}.`
        : `Me interesa: ${form.producto} (${form.linea}).`
    );
    if (form.mensaje.trim()) {
      lines.push("", form.mensaje.trim());
    }
    const extras: string[] = [];
    if (form.correo.trim()) extras.push(`Correo: ${form.correo.trim()}`);
    if (form.tel.trim()) extras.push(`Tel: ${form.tel.trim()}`);
    if (extras.length) lines.push("", extras.join(" · "));
    return lines.join("\n");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.nombre.trim() || !emailOk(form.correo.trim())) {
      setTried(true);
      if (formRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        formRef.current.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-8px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(-3px)" },
            { transform: "none" },
          ],
          { duration: 420, easing: "ease-out" }
        );
      }
      return;
    }

    setSent(true);
    const url = `https://wa.me/${selectedPhone.raw}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main
      ref={rootRef}
      className="relative w-full min-h-screen bg-[#f4f6f7] bg-[linear-gradient(rgba(14,31,46,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,31,46,.05)_1px,transparent_1px)] bg-[size:56px_56px] bg-[position:center_top] text-[#0e1f2e] font-sans pb-16 pt-6 md:pt-8 md:pb-20"
    >
      <div className="container-site flex flex-col gap-6 md:gap-8">
        {/* Breadcrumb unificado */}
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Contacto" },
          ]}
        />

        {/* Header editorial */}
        <header className="flex flex-wrap items-end justify-between gap-6 md:gap-12">
          <div className="flex flex-1 flex-col gap-4 min-w-[280px]">
            <h1 className="font-sans text-[clamp(36px,5.2vw,72px)] font-bold leading-[1.02] tracking-[-0.04em] text-[#0e1f2e]">
              <span className="block overflow-hidden pb-1">
                <span data-line="0" className="block">
                  Hablemos de
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span data-line="1" className="block text-[#1769c2]">
                  tu proyecto.
                </span>
              </span>
            </h1>
          </div>

          <p
            data-rv="1"
            className="max-w-[420px] font-sans text-[15px] sm:text-[16.5px] leading-relaxed text-[#45596b] text-pretty"
          >
            Completa el formulario y te respondemos por WhatsApp con asesoría y una cotización personalizada hoy mismo.
          </p>
        </header>

        {/* Grilla Principal: Aside de contacto + Formulario */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ─── ASIDE DE CONTACTO (4 columnas en desktop) ────────────────── */}
          <aside
            data-rv="2"
            className="relative flex flex-col gap-6 overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#0e1f2e] p-6 text-white shadow-xl isolate sm:p-8 lg:col-span-5 lg:gap-7"
          >
            {/* Glow radial ambiental */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[25%] -top-[30%] h-[80%] w-[80%] bg-[radial-gradient(closest-side,rgba(23,105,194,.5),transparent)] -z-10"
            />

            {/* Ondas decorativas de agua en el fondo animadas con drift */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[100px] overflow-hidden -z-10 opacity-75"
            >
              <svg
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className="absolute left-0 bottom-0 w-[200%] h-full animate-[drift_16s_linear_infinite]"
              >
                <path
                  d="M0 60 C 180 20 360 100 540 60 S 900 20 1080 60 S 1260 100 1440 60 S 1620 20 1800 60 S 2160 100 2340 60 S 2700 20 2880 60 V120 H0Z"
                  fill="rgba(23,105,194,.28)"
                />
              </svg>
              <svg
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className="absolute left-0 bottom-0 w-[200%] h-[75%] animate-[drift_10s_linear_infinite_reverse]"
              >
                <path
                  d="M0 60 C 180 100 360 20 540 60 S 900 100 1080 60 S 1260 20 1440 60 S 1620 100 1800 60 S 2160 20 2340 60 S 2700 100 2880 60 V120 H0Z"
                  fill="rgba(79,155,232,.22)"
                />
              </svg>
            </div>

            {/* Cabecera del Asesor */}
            <div className="flex items-center gap-3.5">
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-[#1769c2] font-sans text-xl font-bold tracking-[-0.02em] text-white">
                ST
                <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-[#2fa36b] ring-3 ring-[#0e1f2e]" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8fc0f0]">
                  Tu asesora técnica
                </span>
                <span className="font-sans text-xl font-bold tracking-[-0.02em] text-white">
                  Silvana Troyani
                </span>
              </div>
            </div>

            {/* Tarjetas de teléfono y WhatsApp */}
            <div className="flex flex-col gap-3">
              {PHONES.map((p) => (
                <div
                  key={p.raw}
                  className="flex items-center gap-3 rounded-[18px] bg-white/[0.06] p-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-colors hover:bg-white/[0.09]"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#8fa6ba]">
                      {p.label}
                    </span>
                    <span className="font-mono text-[16px] sm:text-[17px] font-semibold tracking-[-0.01em] text-white tabular-nums">
                      {p.display}
                    </span>
                  </div>

                  {/* Botón Llamar */}
                  <a
                    href={`tel:+${p.raw}`}
                    aria-label={`Llamar al ${p.display}`}
                    className="flex size-10.5 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white transition-colors hover:bg-white/20"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>

                  {/* Botón WhatsApp */}
                  <a
                    href={`https://wa.me/${p.raw}?text=${encodeURIComponent(
                      "Hola Silvana, deseo consultar sobre productos y cotizaciones con Troyani Inversiones."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp al ${p.display}`}
                    className="flex size-10.5 shrink-0 items-center justify-center rounded-xl bg-[#2fa36b] text-white shadow-md transition-colors hover:bg-[#38b878]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.2 9.3c.3 1.6 1.9 3.3 3.6 3.8l1-1 1.7.7-.4 1.5c-2.9.2-6.2-3-6-6l1.5-.4.7 1.7-1 1Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              ))}

              {/* Tarjeta de Correo con botón de Copiar */}
              <div className="flex items-center gap-3 rounded-[18px] bg-white/[0.06] p-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#8fa6ba]">
                    Correo de ventas
                  </span>
                  <a
                    href="mailto:stroyani@troyaniinversiones.com"
                    className="truncate font-sans text-[14.5px] font-medium text-white transition-colors hover:text-[#8fc0f0]"
                  >
                    stroyani@troyaniinversiones.com
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  className={`h-10 shrink-0 rounded-xl px-3.5 font-sans text-xs font-semibold text-white transition-colors duration-300 ${
                    copied ? "bg-[#2fa36b]" : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            {/* Enlace al sitio web y despacho */}
            <div className="flex flex-col gap-1 pb-10">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#8fa6ba]">
                Sitio web oficial
              </span>
              <a
                href="https://www.troyaniinversiones.com"
                className="font-sans text-[15.5px] font-semibold text-white transition-colors hover:text-[#8fc0f0]"
              >
                www.troyaniinversiones.com
              </a>
              <span className="pt-2 text-xs text-[#8fa6ba]/90 leading-relaxed">
                Distribuidor autorizado Rotoplas y Banjo · Despacho y cobertura en todo el Perú.
              </span>
            </div>
          </aside>

          {/* ─── FORMULARIO INTERACTIVO (7 columnas en desktop) ─────────────── */}
          <form
            ref={formRef}
            data-rv="3"
            onSubmit={handleSubmit}
            noValidate
            className="relative flex flex-col gap-5 rounded-[24px] sm:rounded-[28px] bg-white p-6 shadow-[0_30px_70px_-44px_rgba(14,31,46,0.4),0_0_0_1px_rgba(14,31,46,0.06)] sm:p-8 md:p-9 lg:col-span-7"
          >
            <div className="flex items-center gap-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-[#5b7083]">
              <span className="h-px flex-1 bg-[#0e1f2e]/10" aria-hidden="true" />
              <span>O cuéntanos tu proyecto aquí</span>
              <span className="h-px flex-1 bg-[#0e1f2e]/10" aria-hidden="true" />
            </div>

            {/* Fila 1: Nombre y Correo */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-sm font-semibold text-[#0e1f2e]">
                  Nombre <span className="text-[#1769c2]">*</span>
                </span>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setField("nombre", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, nombre: true }))}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                  className={`h-13 rounded-2xl border bg-white px-4 font-sans text-[15px] text-[#0e1f2e] outline-none transition-all placeholder:text-[#8a9aa8] focus:border-[#1769c2] focus:ring-4 focus:ring-[#1769c2]/10 ${
                    nombreErr ? "border-[#d64545]" : "border-[#0e1f2e]/15"
                  }`}
                />
                {nombreErr && (
                  <span className="text-xs font-medium text-[#d64545]">
                    Por favor escribe tu nombre para dirigirnos a ti.
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-sans text-sm font-semibold text-[#0e1f2e]">
                  Correo <span className="font-normal text-[#8a9aa8]">(opcional)</span>
                </span>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => setField("correo", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, correo: true }))}
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  className={`h-13 rounded-2xl border bg-white px-4 font-sans text-[15px] text-[#0e1f2e] outline-none transition-all placeholder:text-[#8a9aa8] focus:border-[#1769c2] focus:ring-4 focus:ring-[#1769c2]/10 ${
                    correoErr ? "border-[#d64545]" : "border-[#0e1f2e]/15"
                  }`}
                />
                {correoErr && (
                  <span className="text-xs font-medium text-[#d64545]">
                    Revisa el formato del correo ingresado.
                  </span>
                )}
              </label>
            </div>

            {/* Teléfono opcional */}
            <label className="flex flex-col gap-2">
              <span className="font-sans text-sm font-semibold text-[#0e1f2e]">
                WhatsApp o teléfono de contacto <span className="font-normal text-[#8a9aa8]">(opcional)</span>
              </span>
              <input
                type="tel"
                value={form.tel}
                onChange={(e) => setField("tel", e.target.value)}
                placeholder="+51 · 9XX XXX XXX"
                autoComplete="tel"
                className="h-13 rounded-2xl border border-[#0e1f2e]/15 bg-white px-4 font-sans text-[15px] text-[#0e1f2e] outline-none transition-all placeholder:text-[#8a9aa8] focus:border-[#1769c2] focus:ring-4 focus:ring-[#1769c2]/10"
              />
            </label>

            {/* ¿Qué necesitas? (Pills de Línea + Selector) */}
            <div className="flex flex-col gap-2.5">
              <span className="font-sans text-sm font-semibold text-[#0e1f2e]">
                ¿Qué tipo de solución buscas?
              </span>
              <div className="flex flex-wrap gap-2">
                {LINEAS.map((l) => {
                  const isSelected = form.linea === l;
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          linea: l,
                          producto: PRODUCTOS[l][0],
                        }))
                      }
                      className={`h-11 flex-1 rounded-full px-4 font-sans text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200 ${
                        isSelected
                          ? "bg-[#0e1f2e] text-white shadow-md"
                          : "border border-[#0e1f2e]/15 bg-white text-[#0e1f2e] hover:bg-[#f4f6f7]"
                      }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>

              {/* Selector de producto según la línea activa */}
              <div className="relative flex items-center pt-1">
                <select
                  value={form.producto}
                  onChange={(e) => setField("producto", e.target.value)}
                  className="h-13 w-full cursor-pointer appearance-none rounded-2xl border border-[#0e1f2e]/15 bg-white pl-4 pr-11 font-sans text-[14.5px] font-medium text-[#0e1f2e] outline-none transition-all focus:border-[#1769c2] focus:ring-4 focus:ring-[#1769c2]/10"
                >
                  {PRODUCTOS[form.linea].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 text-[#0e1f2e]"
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="m3 4.5 3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Mensaje */}
            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-sans text-sm font-semibold text-[#0e1f2e]">
                <span>Mensaje o detalles de tu proyecto</span>
                <span className="font-mono text-xs font-normal text-[#8a9aa8]">
                  {form.mensaje.length}/600
                </span>
              </div>
              <textarea
                value={form.mensaje}
                onChange={(e) => setField("mensaje", e.target.value)}
                rows={4}
                maxLength={600}
                placeholder="¿Para qué lo vas a usar? Agua, químicos, pisco… Cuéntanos la capacidad aproximada, el distrito o región de entrega y cualquier duda que tengas."
                className="min-h-[120px] rounded-2xl border border-[#0e1f2e]/15 bg-white p-4 font-sans text-[14.5px] leading-relaxed text-[#0e1f2e] outline-none transition-all placeholder:text-[#8a9aa8] focus:border-[#1769c2] focus:ring-4 focus:ring-[#1769c2]/10"
              />
            </label>

            {/* ─── SELECTOR DE NÚMERO DESTINO (Requerimiento especial del usuario) ─── */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#0e1f2e]/10">
              <span className="font-sans text-xs font-semibold text-[#3d5a73] uppercase tracking-wider">
                ¿A qué número de WhatsApp deseas enviar tu mensaje?
              </span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {PHONES.map((ph) => {
                  const isCur = selectedPhone.raw === ph.raw;
                  return (
                    <button
                      key={ph.raw}
                      type="button"
                      onClick={() => setSelectedPhone(ph)}
                      className={`flex items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                        isCur
                          ? "border-2 border-[#1769c2] bg-[#eaf2fb] shadow-sm"
                          : "border border-[#0e1f2e]/15 bg-white hover:bg-[#f4f6f7]"
                      }`}
                    >
                      <span
                        className={`flex size-4.5 shrink-0 items-center justify-center rounded-full border ${
                          isCur
                            ? "border-[#1769c2] bg-[#1769c2]"
                            : "border-[#8a9aa8]"
                        }`}
                      >
                        {isCur && <span className="size-1.5 rounded-full bg-white" />}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono text-[14px] font-bold text-[#0e1f2e]">
                          {ph.display}
                        </span>
                        <span className="font-sans text-[11px] text-[#5b7083]">
                          {ph.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón de Enviar a WhatsApp con shine y microflecha */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="submit"
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  const arrow = el.querySelector<HTMLElement>("[data-arrow]");
                  const shine = el.querySelector<HTMLElement>("[data-shine]");
                  if (arrow) arrow.style.transform = "translateX(3px)";
                  if (shine) shine.style.transform = "translateX(260%)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  const arrow = el.querySelector<HTMLElement>("[data-arrow]");
                  const shine = el.querySelector<HTMLElement>("[data-shine]");
                  if (arrow) arrow.style.transform = "";
                  if (shine) shine.style.transform = "translateX(-140%)";
                }}
                className={`group relative flex h-14 min-w-[240px] flex-1 items-center justify-between gap-3 overflow-hidden rounded-2xl pl-5 pr-2 font-sans text-[15.5px] font-semibold transition-all duration-400 ${
                  sent
                    ? "bg-[#2fa36b] text-white shadow-lg"
                    : "bg-[#f5b82e] text-[#0e1f2e] shadow-[0_16px_36px_-18px_rgba(245,184,46,0.85)] hover:bg-[#ffc640]"
                }`}
              >
                <span
                  data-shine="1"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-800 ease-[cubic-bezier(.2,.8,.2,1)]"
                />
                <span className="relative">
                  {sent ? "Abriendo WhatsApp…" : "Enviar por WhatsApp"}
                </span>

                <span className="relative flex size-10 items-center justify-center rounded-xl bg-[#0e1f2e] text-white">
                  <span
                    data-arrow="1"
                    className="flex transition-transform duration-450 ease-[cubic-bezier(.2,.8,.2,1)]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d={sent ? "M5 12.5 10 17.5 19 7" : "M4 12h14M13 6l6 6-6 6"}
                        stroke="#ffffff"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </button>

              <span className="flex-1 font-sans text-xs leading-relaxed text-[#5b7083]">
                Se abrirá WhatsApp con tu mensaje listo para enviar a{" "}
                <strong className="text-[#0e1f2e]">{selectedPhone.display}</strong> ({selectedPhone.desc}).
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
