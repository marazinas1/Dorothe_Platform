import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/types/site-settings";
import { actionButtonClass } from "@/components/brand/ui/ActionButton";

type Props = {
  locale: Locale;
  settings: SiteSettings;
  /** Overrides the default sentence when a page needs its own wording. */
  headingKey?: string;
  tone?: "paper" | "ink";
};

/**
 * The single closing call to action for the whole public site. Every page that
 * does not already end in a form ends in this band, so the next step is always
 * in the same place and looks the same: one filled action, one quiet one.
 */
export function CtaBand({ locale, settings, headingKey, tone = "paper" }: Props) {
  const { t } = useTranslation();
  const dark = tone === "ink";
  const phone = settings.contact_phone?.trim();

  return (
    <section
      className={
        dark
          ? "bg-primary text-primary-foreground"
          : "border-y border-border bg-secondary text-foreground"
      }
    >
      <div className="mx-auto flex max-w-[1220px] flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
        <div className="max-w-[42ch]">
          <div
            className={
              dark
                ? "eyebrow text-primary-foreground/70"
                : "eyebrow text-muted-foreground"
            }
          >
            {t("cta.kicker")}
          </div>
          <h2 className="mt-4 font-heading text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.18]">
            {t(headingKey ?? "cta.heading")}
          </h2>
          <p
            className={
              dark
                ? "mt-4 text-[15px] leading-7 text-primary-foreground/75"
                : "mt-4 text-[15px] leading-7 text-muted-foreground"
            }
          >
            {t("cta.body")}
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            to="/$locale/kontakt"
            params={{ locale }}
            className={actionButtonClass(dark ? "on-dark" : "primary")}
          >
            {t("cta.primary")}
          </Link>
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className={
                dark
                  ? "text-sm text-primary-foreground/80 underline-offset-4 hover:underline"
                  : "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              }
            >
              {t("cta.secondary")} {phone}
            </a>
          ) : settings.contact_email ? (
            <a
              href={`mailto:${settings.contact_email}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {settings.contact_email}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
