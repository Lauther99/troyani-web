import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Botones del sistema (wireframe pág. 20):
 * - cta:       conversión (amarillo). Header, panel de producto, cierres.
 * - primary:   acción principal no comercial (navy). Hero, "Continuar".
 * - secondary: contorno azul industrial.
 * Renderiza <a> si recibe href (externo si empieza con http), si no <button>.
 */
type Variant = "cta" | "primary" | "secondary";

type BaseProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Muestra el ícono de WhatsApp a la izquierda (18 px). */
  whatsapp?: boolean;
  /** Estado de carga: conserva el ancho, aria-busy, no clicable. Pasarlo (true/false) solo si el botón puede cargar. */
  loading?: boolean;
  loadingLabel?: string;
  /** Se evita; si es inevitable: opacidad 45 % y aria-disabled. */
  disabled?: boolean;
  fullWidth?: boolean;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: () => void;
};

const base =
  "relative inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 text-base select-none " +
  "transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98] active:duration-100";

const variants: Record<Variant, string> = {
  cta: "bg-accent font-bold text-primary hover:bg-accent-hover active:bg-accent-pressed",
  primary: "bg-primary font-semibold text-surface hover:bg-primary-hover active:bg-primary-pressed",
  secondary:
    "border-[1.5px] border-secondary bg-transparent font-semibold text-secondary hover:bg-tint-tech " +
    "active:border-primary active:bg-tint-tech-pressed active:text-primary",
};

const inactive = "pointer-events-none cursor-default opacity-45 active:scale-100";

export default function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "cta",
    children,
    className,
    whatsapp,
    loading,
    loadingLabel = "Enviando…",
    disabled,
    fullWidth,
  } = props;

  const classes = cx(
    base,
    variants[variant],
    fullWidth && "w-full",
    disabled && inactive,
    loading && "pointer-events-none cursor-default",
    className,
  );

  // Texto normal y texto de carga apilados en la misma celda de grid:
  // el botón mide lo que el más ancho de los dos, así el ancho no salta al cargar.
  const content = (
    <span className="grid place-items-center">
      <span
        className={cx(
          "inline-flex items-center gap-2 whitespace-nowrap [grid-area:1/1]",
          loading && "invisible",
        )}
      >
        {whatsapp && <WhatsAppIcon className="size-[18px] shrink-0" />}
        {children}
      </span>
      {/* Solo los botones que pueden cargar (loading definido) reservan ese ancho */}
      {loading !== undefined && (
        <span
          aria-hidden={!loading}
          className={cx(
            "inline-flex items-center gap-2 whitespace-nowrap [grid-area:1/1]",
            !loading && "invisible",
          )}
        >
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {loadingLabel}
        </span>
      )}
    </span>
  );

  const state = {
    "aria-disabled": disabled || undefined,
    "aria-busy": loading || undefined,
  };

  if (props.href !== undefined) {
    const external = props.href.startsWith("http");
    if (external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={props.onClick}
          {...state}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes} onClick={props.onClick} {...state}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      onClick={disabled || loading ? undefined : props.onClick}
      {...state}
    >
      {content}
    </button>
  );
}
