import { usePublicLocale } from "@/lib/config/use-public-locale";
import { Link, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";

type Props = {
  /** Unique per form, so several forms can live on one page. */
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Shown when the visitor submits without ticking. */
  showError?: boolean;
};

/**
 * Data-protection consent for every public form that collects personal data.
 * Unchecked by default, required, and the privacy link opens in a new tab so
 * nothing the visitor typed is lost.
 */
export function ConsentCheckbox({ id, checked, onChange, showError }: Props) {
  const { t } = useTranslation();
  const locale = usePublicLocale();

  return (
    <div>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
        <input
          id={id}
          name="consent"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          aria-invalid={showError || undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-describedby={showError ? `${id}-error` : undefined}
        />
        <span className="text-sm leading-relaxed text-muted-foreground">
          {t("consent.text")}{" "}
          <Link
            to="/$locale/datenschutz"
            params={{ locale }}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            {t("consent.link")}
          </Link>
        </span>
      </label>
      {showError ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {t("consent.required")}
        </p>
      ) : null}
    </div>
  );
}
