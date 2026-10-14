"use client";

import { useId, type InputHTMLAttributes } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { cx } from "@/lib/cx";

/**
 * Campo de formulario (wireframe pág. 21, punto 7):
 * - Label siempre visible encima del input (nunca placeholder como única etiqueta).
 * - Pista de formato (`hint`) encima del input para que el teclado móvil o el autocompletado no la tapen.
 * - Error explícito con ícono + cómo corregir; soporta validación controlada (`error`) y `:user-invalid`.
 * - Estado válido (`valid`) con borde e ícono de confirmación.
 */
type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  valid?: boolean;
};

export default function Field({
  id: providedId,
  label,
  hint,
  error,
  valid,
  className,
  ...inputProps
}: Props) {
  const autoId = useId();
  const id = providedId ?? autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] leading-snug font-medium text-text">
        {label}
      </label>

      {hint && (
        <span id={hintId} className="text-xs leading-snug text-text-muted">
          {hint}
        </span>
      )}

      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            "h-11 w-full rounded-control border bg-surface px-3 text-[15px] text-text transition-colors duration-150 ease-out placeholder:text-text-disabled",
            error
              ? "border-danger bg-tint-danger pr-9"
              : valid
                ? "border-success pr-9"
                : "border-border-strong user-invalid:border-danger user-invalid:bg-tint-danger",
            className,
          )}
          {...inputProps}
        />

        {valid && !error && (
          <Check
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-success"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-danger-text">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
