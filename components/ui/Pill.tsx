import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Pills de litraje y chips de filtro (wireframe pág. 21, punto 6).
 * - Con href: enlace real (selector de capacidad del Hero). Funciona sin JS.
 * - Sin href: botón toggle con aria-pressed (filtros del catálogo).
 * Alto 44 px en móvil; 36 px en desktop con área táctil extendida a 44 px.
 */
type Props = {
  children: ReactNode;
  selected?: boolean;
  /** Sin resultados: atenuada, aria-disabled y no clicable. */
  disabled?: boolean;
  /** Conteo visible, p. ej. "(0)" cuando no hay resultados. */
  count?: number;
  href?: string;
  onClick?: () => void;
  className?: string;
};

const base =
  "relative inline-flex h-11 items-center justify-center rounded-full border px-4 text-sm font-medium whitespace-nowrap " +
  "transition-colors duration-150 ease-out md:h-9 " +
  "md:before:absolute md:before:-inset-y-1 md:before:inset-x-0 md:before:content-['']";

const states = {
  idle: "border-border-strong bg-surface text-primary hover:border-secondary hover:bg-tint-tech",
  selected: "border-primary bg-primary text-surface",
  disabled: "pointer-events-none border-border bg-surface text-text-disabled",
};

export default function Pill({ children, selected, disabled, count, href, onClick, className }: Props) {
  const classes = cx(
    base,
    disabled ? states.disabled : selected ? states.selected : states.idle,
    className,
  );

  const label = (
    <>
      {children}
      {count !== undefined && <span className="ml-1 tabular-nums">({count})</span>}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} aria-current={selected ? "true" : undefined}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected ?? false}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
    >
      {label}
    </button>
  );
}
