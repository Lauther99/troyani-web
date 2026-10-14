"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { mensajeGenerico, whatsappUrl } from "@/lib/whatsapp";

/**
 * Sticky bar móvil (wireframe págs. 7 y 21):
 * - Fondo `#172B3A` (`bg-primary`), alto 56 px + `env(safe-area-inset-bottom)`.
 * - Aparece cuando el Hero (`#hero-home`) sale de pantalla (`IntersectionObserver`, no un % fijo).
 * - Se oculta al entrar el `<footer>` (que ya tiene su propio botón de WhatsApp)
 *   y cuando el teclado virtual está abierto o un campo de formulario tiene foco.
 */
type Props = {
  heroId?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function StickyBar({
  heroId = "hero-home",
  ctaHref = whatsappUrl(mensajeGenerico("/")),
  ctaLabel = "Cotizar por WhatsApp",
}: Props) {
  const [heroOut, setHeroOut] = useState(false);
  const [footerIn, setFooterIn] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const footer = document.querySelector("footer");

    const heroObserver =
      hero &&
      new IntersectionObserver(
        ([entry]) => {
          setHeroOut(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
        },
        { threshold: 0 },
      );

    const footerObserver =
      footer &&
      new IntersectionObserver(
        ([entry]) => {
          setFooterIn(entry.isIntersecting);
        },
        { threshold: 0 },
      );

    if (hero && heroObserver) heroObserver.observe(hero);
    if (footer && footerObserver) footerObserver.observe(footer);

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target;
      if (el instanceof HTMLElement && el.matches("input, textarea, select")) {
        setKeyboardOpen(true);
      }
    };
    const onFocusOut = (e: FocusEvent) => {
      const el = e.target;
      if (el instanceof HTMLElement && el.matches("input, textarea, select")) {
        setKeyboardOpen(false);
      }
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      heroObserver?.disconnect();
      footerObserver?.disconnect();
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [heroId]);

  const visible = heroOut && !footerIn && !keyboardOpen;

  return (
    <div
      aria-hidden={!visible}
      className={cx(
        "fixed inset-x-0 bottom-0 z-30 border-t border-secondary bg-primary pb-[env(safe-area-inset-bottom)] transition-transform duration-200 ease-out md:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <div className="container-site flex h-14 items-center justify-between gap-3">
        <p className="text-[13px] leading-tight font-medium text-text-nav">
          Precios en S/
          <span className="block font-semibold text-surface">con IGV incluido</span>
        </p>
        <Button
          href={ctaHref}
          variant="cta"
          whatsapp
          className={cx("min-h-11 px-4 text-sm", !visible && "tabindex-[-1]")}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
