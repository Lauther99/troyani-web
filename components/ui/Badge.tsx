import type { ReactNode } from "react";
import { AlertTriangle, Check, Circle, X } from "lucide-react";
import { cx } from "@/lib/cx";

/**
 * Badges técnicos y semánticos (wireframe pág. 21).
 * El color nunca es el único portador de significado: los semánticos llevan ícono.
 */
type Tone = "litraje" | "tech" | "ok" | "stock" | "danger" | "incompatible" | "neutral";

const tones: Record<Tone, string> = {
  litraje: "bg-accent border-accent text-primary",
  tech: "bg-tint-tech border-tint-tech-border text-secondary",
  ok: "bg-tint-ok border-tint-ok-border text-success-text",
  stock: "bg-tint-ok border-tint-ok-border text-success-text",
  danger: "bg-tint-danger border-tint-danger-border text-danger-text",
  incompatible: "bg-tint-danger border-tint-danger-border text-danger-text",
  neutral: "bg-surface border-border-strong text-text-muted",
};

const icons: Partial<Record<Tone, ReactNode>> = {
  ok: <Check className="size-3 text-success" strokeWidth={3} aria-hidden="true" />,
  stock: <Circle className="size-2 fill-success text-success" aria-hidden="true" />,
  danger: <AlertTriangle className="size-3 text-danger" strokeWidth={2.5} aria-hidden="true" />,
  incompatible: <X className="size-3 text-danger" strokeWidth={3} aria-hidden="true" />,
};

type Props = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export default function Badge({ tone = "neutral", children, className }: Props) {
  return (
    <span
      className={cx(
        "inline-flex h-[22px] items-center gap-1 rounded-full border px-2 text-xs font-semibold tracking-[0.04em] whitespace-nowrap",
        // El litraje es una cifra: no va en mayúsculas forzadas.
        tone !== "litraje" && "uppercase",
        tones[tone],
        className,
      )}
    >
      {icons[tone]}
      {children}
    </span>
  );
}
