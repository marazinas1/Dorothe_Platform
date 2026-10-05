import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { buttonClass } from "@/components/brand/ui/Button";
import type { HomeTemplateProps } from "../types";

/**
 * Full-bleed seller-first opening from the approved broker-site reference.
 */
export function H1Hero({ locale, copy, media, settings }: HomeTemplateProps) {
  const { t } = useTranslation();
  const kicker = copy.text("hero_kicker");

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-foreground text-on-media lg:min-h-[724px]">
      {media.hero ? (
        <img
          src={media.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      ) : null}
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[720px] w-full max-w-[1280px] flex-col justify-end px-5 pb-9 pt-20 md:px-10 lg:min-h-[724px]">
        <div className="max-w-[670px]">
          {kicker ? <div className="eyebrow text-on-media-muted">{kicker}</div> : null}
          <h1 className="mt-4 max-w-[14ch] text-balance text-[clamp(2.5rem,5.3vw,4.75rem)] font-bold leading-[1.02] hyphens-auto text-on-media">
            {copy.text("hero_headline")}
          </h1>
          <p className="mt-4 max-w-[56ch] text-[clamp(1rem,1.4vw,1.3125rem)] leading-[1.55] text-on-media-muted">
            {copy.text("hero_subline")}
          </p>
        </div>
        <div className="mt-8 flex flex-col items-start gap-4 rounded-[var(--radius)] bg-background p-5 text-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <div className="font-heading text-base font-bold">{t("home.valuation_title")}</div>
            <div className="mt-1 text-sm text-muted-foreground">{copy.text("valuation_body")}</div>
          </div>
          <Link to="/$locale/verkaufen" hash="form" params={{ locale }} className={buttonClass({ variant: "primary", className: "shrink-0" })}>{t("home.hero_cta")}</Link>
        </div>
        <div className="mt-6 grid gap-4 border-t border-on-media/25 pt-5 text-xs text-on-media md:grid-cols-3">
          {[copy.text("cred1_tag"), copy.text("cred3_tag"), copy.text("cred2_tag")].filter(Boolean).map((item) => (
            <span key={item} className="inline-flex items-start gap-2"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
