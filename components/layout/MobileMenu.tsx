"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { formatTelefono } from "@/lib/format";
import { companyNav, isActive, mainNav } from "@/lib/nav";
import { site } from "@/lib/site";

/**
 * P5 · Menú móvil (wireframe pág. 19). <dialog> nativo con showModal():
 * foco atrapado, Esc cierra y el foco vuelve al botón que lo abrió sin JS extra.
 */
export default function MobileMenu({ ctaHref }: { ctaHref: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  // Se cierra solo al navegar.
  useEffect(() => {
    close();
  }, [pathname]);

  // Enlaces de 1A sin duplicar: nav principal + Contacto.
  const links = [...mainNav, ...companyNav.filter((l) => !mainNav.some((m) => m.href === l.href))];

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Abrir menú"
        aria-haspopup="dialog"
        className="inline-flex size-11 items-center justify-center rounded-control text-surface lg:hidden"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menú"
        className="mobile-menu m-0 h-dvh max-h-none w-full max-w-none bg-primary p-0 text-surface backdrop:bg-[var(--overlay-veil)]"
      >
        <div className="flex h-full flex-col">
          <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={close} aria-label="Troyani Inversiones, ir al inicio">
              <Image
                src="/brand/logo-troyani-blanco.webp"
                alt="Troyani Inversiones"
                width={857}
                height={244}
                className="h-9 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="inline-flex size-11 items-center justify-center rounded-control text-surface"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Principal" className="container-site flex-1 overflow-y-auto pt-6">
            <ul className="flex flex-col">
              {links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "flex min-h-14 items-center border-b border-surface/10 font-display text-2xl font-bold",
                        active ? "text-surface" : "text-text-nav",
                      )}
                    >
                      <span className={cx(active && "border-b-2 border-accent pb-0.5")}>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

          </nav>

          {/* CTA anclado abajo, al alcance del pulgar */}
          <div className="container-site shrink-0 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <Button href={ctaHref} variant="cta" whatsapp fullWidth onClick={close}>
              Cotizar por WhatsApp
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
