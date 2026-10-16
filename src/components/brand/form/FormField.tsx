import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

/** One field look for every public form: boxed input, label above, never placeholder-only. */
export const fieldInputCls =
  "min-h-11 w-full border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors duration-150 focus:border-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive";
export const fieldLabelCls = "mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-foreground";

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/**
 * Validates after the visitor leaves a field (Baymard: onBlur, never while
 * typing) and replaces the browser bubble with words under the field that say
 * how to fix it. Values are never cleared.
 */
export function useFieldError() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const read = (el: Control) => {
    if (el.validity.valid) return null;
    if (el.validity.valueMissing) return t("form.required");
    if (el.validity.typeMismatch && el.type === "email") return t("form.email_invalid");
    return t("form.invalid");
  };
  return {
    error,
    handlers: {
      onBlur: (e: React.FocusEvent<Control>) => setError(read(e.currentTarget)),
      onInvalid: (e: React.FormEvent<Control>) => {
        e.preventDefault();
        setError(read(e.currentTarget));
      },
      onInput: (e: React.FormEvent<Control>) => {
        if (error && e.currentTarget.validity.valid) setError(null);
      },
    },
  };
}

type Shell = { id: string; label: string; optional?: boolean; help?: ReactNode; className?: string };

export function FieldShell({ id, label, optional, help, error, className, children }: Shell & { error: string | null; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <label className={fieldLabelCls} htmlFor={id}>
        <span>{label}</span>
        {optional ? <span className="text-xs font-normal text-muted-foreground">{t("form.optional")}</span> : null}
      </label>
      {children}
      {help && !error ? <p id={`${id}-help`} className="mt-2 text-xs text-muted-foreground">{help}</p> : null}
      {error ? <p id={`${id}-error`} className="mt-2 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

const describedBy = (id: string, help: unknown, error: string | null) =>
  error ? `${id}-error` : help ? `${id}-help` : undefined;

export function FormField({ id, label, optional, help, className, ...rest }: Shell & InputHTMLAttributes<HTMLInputElement>) {
  const { error, handlers } = useFieldError();
  return (
    <FieldShell id={id} label={label} optional={optional} help={help} error={error} className={className}>
      <input id={id} required={!optional} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, help, error)} className={fieldInputCls} {...handlers} {...rest} />
    </FieldShell>
  );
}

export function FormTextarea({ id, label, optional, help, className, ...rest }: Shell & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { error, handlers } = useFieldError();
  return (
    <FieldShell id={id} label={label} optional={optional} help={help} error={error} className={className}>
      <textarea id={id} required={!optional} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, help, error)} className={cn(fieldInputCls, "resize-y")} {...handlers} {...rest} />
    </FieldShell>
  );
}
