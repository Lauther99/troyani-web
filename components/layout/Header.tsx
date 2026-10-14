"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mensajeGenerico, whatsappUrl } from "@/lib/whatsapp";

interface NavLinkItem {
  key: string;
  label: string;
  href: string;
  mega?: boolean;
}

const LINKS: NavLinkItem[] = [
  { key: "Inicio", label: "Inicio", href: "/" },
  { key: "Catálogo", label: "Catálogo", href: "/catalogo/", mega: true },
  { key: "Nosotros", label: "Nosotros", href: "/nosotros/" },
  { key: "Contacto", label: "Contacto", href: "/contacto/" },
];

const MEGA_COLS = [
  {
    title: "Línea Hogar",
    count: "06",
    items: [
      { label: "Tanques para agua", short: "Tanques para agua", meta: "700–2,500 L", href: "/catalogo/tanques-para-agua/" },
      { label: "Cisternas", short: "Cisternas", meta: "1,200–10,000 L", href: "/catalogo/cisternas/" },
      { label: "Biodigestores", short: "Biodigestores", meta: "600–7,000 L", href: "/catalogo/biodigestores/" },
      { label: "Bombas", short: "Bombas", meta: "½–1 HP", href: "/catalogo/bombas/" },
      { label: "Filtros y purificadores", short: "Filtros y purificadores", meta: "3 modelos", href: "/catalogo/filtros-y-purificadores/" },
      { label: "Termas", short: "Termas", meta: "3 modelos", href: "/catalogo/termas/" },
    ],
  },
  {
    title: "Línea Agroindustria",
    count: "06",
    items: [
      { label: "Tanques industriales", short: "Tanques industriales", meta: "5,000–25,000 L", href: "/catalogo/tanques-industriales/" },
      { label: "Tanques para pisco y vino", short: "Pisco y vino", meta: "250–25,000 L", href: "/catalogo/tanques-para-pisco-y-vino/" },
      { label: "Tolvas", short: "Tolvas", meta: "600–7,000 L", href: "/catalogo/tolvas/" },
      { label: "Cisterna industrial", short: "Cisterna industrial", meta: "2,800–10,000 L", href: "/catalogo/cisterna-industrial/" },
      { label: "Nodriza industrial", short: "Nodriza industrial", meta: "1,100–5,000 L", href: "/catalogo/nodriza-industrial/" },
      { label: "Accesorios Banjo – USA", short: "Accesorios Banjo", meta: '1"–4"', href: "/catalogo/accesorios-banjo/" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [vw, setVw] = useState(1200);

  const listRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const progRef = useRef<HTMLSpanElement | null>(null);
  const megaRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determinar la clave activa según la ruta
  const getActiveKey = (path: string): string => {
    if (path === "/") return "Inicio";
    if (path.startsWith("/catalogo") || path.startsWith("/productos")) return "Catálogo";
    if (path.startsWith("/nosotros")) return "Nosotros";
    if (path.startsWith("/contacto")) return "Contacto";
    return "Inicio";
  };

  const activeKey = getActiveKey(pathname);

  // Páginas que inician con el estado de Hero oscuro en el tope (Home y Nosotros)
  const startsDark = pathname === "/" || pathname.startsWith("/nosotros");
  const hasHero = pathname === "/" || pathname === "/nosotros" || pathname === "/nosotros/";

  const mobile = vw < 1024;
  const small = vw < 520;

  // El cambio a claro ocurre a los 24 px de scroll, cuando el mega menú está abierto,
  // o en páginas que no tienen hero oscuro.
  const isLight = scrolled || megaOpen || !startsDark;
  const isDarkMenu = menuOpen;
  const fg = isDarkMenu ? "#ffffff" : isLight ? "#0e1f2e" : "#ffffff";
  const ghostBorder = isDarkMenu
    ? "rgba(255,255,255,0.2)"
    : isLight
      ? "rgba(14,31,46,0.14)"
      : "rgba(255,255,255,0.25)";

  const ctaHref = whatsappUrl(mensajeGenerico(pathname));

  // Animación del pill indicador que acompaña al cursor o vuelve a la pestaña activa
  const movePill = (key?: string) => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const targetKey = key || activeKey;
    const targetEl = list.querySelector<HTMLElement>(`[data-key="${targetKey}"]`);
    if (!targetEl) {
      pill.style.width = "0px";
      pill.style.opacity = "0";
      return;
    }
    pill.style.left = `${targetEl.offsetLeft}px`;
    pill.style.width = `${targetEl.offsetWidth}px`;
    pill.style.opacity = "1";
  };

  const openMega = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(true);
  };

  const closeMegaSoon = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    megaTimerRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 160);
  };

  // Scroll y Resize Listeners: detección exacta a 24 px
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const s = y > 24;
      setScrolled(s);

      // Barra de lectura sin transición (sigue el scroll en tiempo real)
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progRef.current) {
        progRef.current.style.width = `${max > 0 ? ((y / max) * 100).toFixed(2) : 0}%`;
      }
    };

    const onResize = () => {
      const w = window.innerWidth;
      setVw(w);
      if (w >= 1024) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    onResize();
    onScroll();

    const t = setTimeout(() => movePill(), 200);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(t);
      if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  // Bloqueo de scroll cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  // Actualizar el pill cuando cambia la ruta
  useEffect(() => {
    setMegaOpen(false);
    setMenuOpen(false);
    movePill();
  }, [pathname]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding:
            scrolled && !isDarkMenu
              ? "10px clamp(10px, 2vw, 20px)"
              : mobile
                ? "12px 12px"
                : "18px clamp(16px, 3vw, 32px)",
          transition: "padding 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          pointerEvents: "none",
        }}
      >
        <div className="relative max-w-[1360px] mx-auto pointer-events-auto">
          {/* Barra Flotante Principal con micro-reducción y cambio de fondo */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "clamp(12px, 2vw, 28px)",
              height: scrolled
                ? mobile ? "60px" : "64px"
                : mobile ? "64px" : "76px",
              padding: mobile
                ? "0 14px 0 10px"
                : scrolled ? "0 12px" : "0 16px",
              borderRadius: mobile ? "20px" : "22px",
              background: isDarkMenu
                ? "var(--color-primary)"
                : isLight
                  ? "rgba(255, 255, 255, 0.82)"
                  : "var(--color-primary)",
              backdropFilter: isDarkMenu ? "none" : "blur(16px) saturate(1.4)",
              WebkitBackdropFilter: isDarkMenu ? "none" : "blur(16px) saturate(1.4)",
              boxShadow: isDarkMenu
                ? "none"
                : isLight
                  ? "0 18px 40px -24px rgba(14, 31, 46, 0.45), 0 0 0 1px rgba(14, 31, 46, 0.06)"
                  : "inset 0 0 0 1px rgba(255, 255, 255, 0.12)",
              transition:
                "height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.5s ease, box-shadow 0.5s ease, border-radius 0.5s ease, padding 0.5s ease",
            }}
          >
            {/* Logotipo con transición suave de blanco a color y reducción de 148 a 124 px */}
            <Link
              href="/"
              onClick={() => {
                setMegaOpen(false);
                setMenuOpen(false);
              }}
              aria-label="Troyani Inversiones, ir al inicio"
              style={{
                position: "relative",
                display: "block",
                flexShrink: 0,
                width: scrolled || small ? "124px" : "148px",
                height: scrolled || small ? "36px" : "44px",
                transition: "width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            >
              <img
                src="/brand/logo-troyani-blanco.webp"
                alt="Troyani Inversiones"
                className="absolute inset-0 h-full w-full object-contain object-left"
                style={{
                  opacity: isLight && !isDarkMenu ? 0 : 1,
                  transition: "opacity 0.4s ease",
                }}
              />
              <img
                src="/brand/logo-troyani-color.webp"
                alt="Troyani Inversiones"
                className="absolute inset-0 h-full w-full object-contain object-left"
                style={{
                  opacity: isLight && !isDarkMenu ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              />
            </Link>

            {/* Navegación Desktop */}
            <nav
              ref={listRef}
              onMouseLeave={() => {
                closeMegaSoon();
                movePill();
              }}
              aria-label="Navegación principal"
              className="relative hidden lg:flex items-center gap-0.5 ml-1 xl:ml-3"
            >
              {/* Sliding Pill animado */}
              <span
                ref={pillRef}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  height: "40px",
                  marginTop: "-20px",
                  borderRadius: "999px",
                  pointerEvents: "none",
                  background: isLight ? "rgba(14, 31, 46, 0.06)" : "rgba(255, 255, 255, 0.12)",
                  transition:
                    "left 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease, opacity 0.3s ease",
                }}
              />

              {LINKS.map((link) => {
                const isA = link.key === activeKey;
                return (
                  <Link
                    key={link.key}
                    data-key={link.key}
                    href={link.href}
                    onMouseEnter={() => {
                      movePill(link.key);
                      if (link.mega) openMega();
                      else closeMegaSoon();
                    }}
                    onClick={(e) => {
                      if (link.mega) {
                        e.preventDefault();
                        setMegaOpen((prev) => !prev);
                      }
                    }}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      height: "40px",
                      padding: "0 16px",
                      borderRadius: "999px",
                      color: isA ? fg : isLight ? "#45596b" : "rgba(255, 255, 255, 0.8)",
                      fontSize: "14.5px",
                      fontWeight: isA ? 600 : 500,
                      whiteSpace: "nowrap",
                      transition: "color 0.35s ease",
                    }}
                  >
                    <span>{link.label}</span>
                    {link.mega && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        style={{
                          transform: megaOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
                        }}
                      >
                        <path
                          d="m2 3.5 3 3 3-3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {/* Punto ámbar indicador activo */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: "4px",
                        width: "4px",
                        height: "4px",
                        marginLeft: "-2px",
                        borderRadius: "999px",
                        backgroundColor: "#f5b82e",
                        opacity: isA ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1" />

            {/* Botón WhatsApp circular ghost */}
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbenos por WhatsApp"
              style={{
                borderColor: ghostBorder,
                color: fg,
              }}
              className="hidden sm:inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 hover:bg-[#0e1f2e]/5 hover:scale-105"
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

            {/* Botón CTA "Cotizar ahora" (se compacta de 46 a 44 px en scroll) */}
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
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
              style={{
                height: scrolled ? "44px" : "46px",
                transition: "height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s ease",
              }}
              className="group relative hidden md:inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full bg-[#f5b82e] pl-4.5 pr-1.5 font-sans text-[14px] sm:text-[14.5px] font-semibold text-[#0e1f2e] shadow-[0_10px_24px_-12px_rgba(245,184,46,.8)] hover:bg-[#ffc640]"
            >
              <span
                data-shine="1"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "0 0 0 0",
                  width: "50%",
                  transform: "translateX(-140%)",
                  background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))",
                  transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  pointerEvents: "none",
                }}
              />
              <span className="relative">Cotizar ahora</span>
              <span className="relative flex size-8 items-center justify-center rounded-full bg-[#0e1f2e] text-white">
                <span
                  data-arrow="1"
                  style={{
                    display: "flex",
                    transition: "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8h11M9 3.5 13.5 8 9 12.5"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </a>

            {/* Botón Hamburger animado en mobile */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setSubOpen(false);
              }}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              style={{
                borderColor: ghostBorder,
                color: fg,
              }}
              className="relative flex size-12 shrink-0 items-center justify-center rounded-full border bg-transparent transition-colors duration-400 lg:hidden"
            >
              <span
                className="absolute inset-x-3.5 top-1/2 h-0.5 -mt-px rounded-full bg-current transition-transform duration-450 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{
                  transform: menuOpen ? "rotate(45deg)" : "translateY(-4px)",
                }}
              />
              <span
                className="absolute inset-x-3.5 top-1/2 h-0.5 -mt-px rounded-full bg-current transition-transform duration-450 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{
                  transform: menuOpen ? "rotate(-45deg)" : "translateY(4px)",
                }}
              />
            </button>

            {/* Barra de progreso de lectura: 2 px en el borde inferior que sigue el scroll en tiempo real */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "24px",
                right: "24px",
                bottom: 0,
                height: "2px",
                borderRadius: "2px",
                overflow: "hidden",
                opacity: scrolled && !isDarkMenu ? 1 : 0,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
              }}
            >
              <span
                ref={progRef}
                style={{
                  display: "block",
                  height: "100%",
                  width: "0%",
                  background: "linear-gradient(90deg, #1769c2, #4f9be8)",
                }}
              />
            </span>
          </div>

          {/* ─── Mega Menú Desplegable ───────────────────────────────────── */}
          {megaOpen && !mobile && (
            <div
              ref={megaRef}
              onMouseEnter={openMega}
              onMouseLeave={() => {
                closeMegaSoon();
                movePill();
              }}
              className="absolute left-0 right-0 top-[calc(100%+10px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)] gap-2 rounded-[24px] bg-white p-2.5 shadow-[0_40px_80px_-40px_rgba(14,31,46,.55),0_0_0_1px_rgba(14,31,46,.06)] animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out"
            >
              {MEGA_COLS.map((col) => (
                <div key={col.title} className="flex flex-col gap-1 p-3.5">
                  <div className="flex items-center justify-between gap-2.5 px-2.5 pb-2 border-b border-[#0e1f2e]/[0.06]">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b7083]">
                      {col.title}
                    </span>
                    <span className="font-mono text-[11px] font-medium text-[#a3b1bd]">
                      {col.count}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-1.5">
                    {col.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={() => setMegaOpen(false)}
                        className="group flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 font-sans text-[14px] font-medium text-[#0e1f2e] transition-all duration-200 hover:bg-[#f1f5f9] hover:pl-3.5"
                      >
                        <span className="truncate">{it.label}</span>
                        <span className="shrink-0 font-mono text-[11px] text-[#1769c2] whitespace-nowrap">
                          {it.meta}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Tarjeta Guía Rápida */}
              <div className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-[18px] bg-[#0e1f2e] p-5 text-white">
                {/* Glow radial de fondo */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-[30%] -top-[40%] h-[120%] w-[90%] bg-[radial-gradient(closest-side,rgba(23,105,194,.55),transparent)]"
                />

                <span className="relative font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8fc0f0]">
                  Guía rápida
                </span>

                <div className="relative flex flex-col gap-2.5">
                  <h3 className="font-sans text-[20px] font-bold leading-tight tracking-[-0.025em] text-white">
                    ¿Qué grado de tanque necesito?
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-[#b9c9d8]">
                    Elige según la densidad de tu químico: Estándar, Reforzado o Doble reforzado.
                  </p>
                  <Link
                    href="/#comparador-grados"
                    onClick={() => setMegaOpen(false)}
                    className="inline-flex items-center gap-1.5 pt-1 font-sans text-[13.5px] font-semibold text-[#f5b82e] hover:text-[#ffc640] transition-colors"
                  >
                    Ver guía de grados →
                  </Link>
                </div>
              </div>

              {/* Barra inferior: Ver catálogo completo */}
              <Link
                href="/catalogo/"
                onClick={() => setMegaOpen(false)}
                className="col-span-full flex items-center justify-between gap-3 rounded-2xl bg-[#f4f6f7] px-4.5 py-3 font-sans text-[14px] font-semibold text-[#0e1f2e] transition-colors hover:bg-[#eaf2fb]"
              >
                <span>Ver todo el catálogo general</span>
                <span className="font-mono text-[11.5px] font-medium text-[#5b7083]">
                  12 categorías · 2 líneas →
                </span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ─── Menú Mobile Pantalla Completa ───────────────────────────── */}
      {menuOpen && mobile && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[#0e1f2e] px-5 pt-24 pb-[calc(20px+env(safe-area-inset-bottom))] text-white animate-in fade-in-0 duration-300"
        >
          {/* Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[30%] -top-[10%] h-[60%] w-[90%] bg-[radial-gradient(closest-side,rgba(23,105,194,.45),transparent)]"
          />

          <nav className="relative flex flex-col pt-2">
            {LINKS.map((link, i) => {
              const isA = link.key === activeKey;
              return (
                <div
                  key={link.key}
                  className="flex flex-col border-b border-white/10"
                >
                  <div className="flex items-center justify-between min-h-[66px]">
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (link.mega) {
                          e.preventDefault();
                          setSubOpen((prev) => !prev);
                        } else {
                          setMenuOpen(false);
                        }
                      }}
                      className="flex flex-1 items-center gap-3.5 pr-2"
                    >
                      <span className="font-mono text-xs font-semibold text-[#5b7083]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-sans text-[26px] font-bold tracking-[-0.03em] ${
                          isA ? "text-[#f5b82e]" : "text-white"
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>

                    {/* Botón de flecha o expandir subcategorías */}
                    <button
                      type="button"
                      onClick={() => {
                        if (link.mega) {
                          setSubOpen((prev) => !prev);
                        } else {
                          setMenuOpen(false);
                          window.location.href = link.href;
                        }
                      }}
                      aria-label={link.mega ? "Expandir categorías" : link.label}
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 ${
                        link.mega && subOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d={link.mega ? "M4 6l4 4 4-4" : "M2 8h11M9 3.5 13.5 8 9 12.5"}
                          stroke="#ffffff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Acordeón de subcategorías en mobile */}
                  {link.mega && subOpen && (
                    <div className="flex flex-col gap-4 pb-5 pl-7 pt-1 animate-in fade-in-0 duration-300">
                      {MEGA_COLS.map((col) => (
                        <div key={col.title} className="flex flex-col gap-2">
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#8fc0f0]">
                            {col.title}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {col.items.map((it) => (
                              <Link
                                key={it.href}
                                href={it.href}
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex min-h-[36px] items-center rounded-full bg-white/[0.07] px-3.5 font-sans text-[13px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] hover:bg-white/[0.14]"
                              >
                                {it.short}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex-1 min-h-8" />

          {/* Información y CTA al final del menú mobile */}
          <div className="relative flex flex-col gap-3 pt-4">
            <span className="font-sans text-[12.5px] leading-relaxed text-[#8fa6ba]">
              Distribuidor autorizado Rotoplas · Despacho seguro a todo el Perú
            </span>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#f5b82e] font-sans text-[15px] font-semibold text-[#0e1f2e] transition-colors hover:bg-[#ffc640]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z"
                  stroke="#0e1f2e"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.2 9.3c.3 1.6 1.9 3.3 3.6 3.8l1-1 1.7.7-.4 1.5c-2.9.2-6.2-3-6-6l1.5-.4.7 1.7-1 1Z"
                  fill="#0e1f2e"
                />
              </svg>
              Cotizar por WhatsApp
            </a>
          </div>

          {/* Onda inferior animada */}
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 bottom-0 w-[200%] h-[90px] opacity-40 animate-[drift_14s_linear_infinite]"
          >
            <path
              d="M0 60 C 180 20 360 100 540 60 S 900 20 1080 60 S 1260 100 1440 60 V120 H0Z"
              fill="rgba(23,105,194,0.35)"
            />
          </svg>
        </div>
      )}

      {/* Espaciador phantom para páginas sin hero inmersivo */}
      {!hasHero && <div aria-hidden="true" className="h-[84px] md:h-[96px] shrink-0" />}
    </>
  );
}
