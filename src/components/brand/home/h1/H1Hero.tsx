import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Phone, ShieldCheck } from "lucide-react";

import { HomeButton } from "../HomeActions";
import { buttonClass } from "@/components/brand/ui/Button";
import type { HomeTemplateProps } from "../types";

/**
 * Full-bleed seller-first opening from the approved broker-site reference.
 */
export function H1Hero({ locale, copy, media, settings }: HomeTemplateProps) {
  const { t } = useTranslation();
  const kicker = copy.text("hero_kicker");

  return (
    <section className="relative min-h-[760px] overflow-hidden bg-foreground text-on-media">
      {media.hero ? (
        <img
          src={media.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      ) : null}
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-[1280px] flex-col justify-end px-5 pt-32 pb-10 md:px-10">
        <div className="max-w-[780px]">
          {kicker ? <div className="eyebrow text-on-media-muted">{kicker}</div> : null}
          <h1 className="mt-5 max-w-[15ch] text-balance text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-bold hyphens-auto text-on-media">
            {copy.text("hero_headline")}
          </h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.55] text-on-media-muted">
            {copy.text("hero_subline")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung" tone="on-dark">
              {t("home.hero_cta")}
            </HomeButton>
            {settings.contact_phone ? (
              <a href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`} className={buttonClass({ variant: "outline", inverse: true })}>
                <Phone className="h-4 w-4" />{settings.contact_phone}
              </a>
            ) : null}
          </div>
        </div>
        <form className="mt-10 grid gap-4 rounded-[var(--radius-card)] bg-background p-5 text-foreground md:grid-cols-[1.3fr_1fr_auto] md:items-end md:p-7" onSubmit={(event) => event.preventDefault()}>
          <div className="md:col-span-3 font-heading text-xl font-bold">{t("home.valuation_title")}</div>
          <label className="grid gap-2 text-sm font-medium">{t("home.hero_form_address")}<input className="min-h-12 rounded-[var(--radius-button)] border border-input bg-background px-4" placeholder={t("home.hero_form_address_hint")} /></label>
          <label className="grid gap-2 text-sm font-medium">{t("home.hero_form_type")}<select className="min-h-12 rounded-[var(--radius-button)] border border-input bg-background px-4"><option>{t("home.hero_form_house")}</option><option>{t("home.hero_form_apartment")}</option><option>{t("home.hero_form_land")}</option></select></label>
          <Link to="/$locale/immobilienbewertung" params={{ locale }} className={buttonClass({ variant: "primary", className: "min-h-12" })}>{t("home.hero_cta")}</Link>
        </form>
        <div className="mt-7 grid gap-4 border-t border-on-media/25 pt-6 text-sm text-on-media md:grid-cols-3">
          {[copy.text("cred1_tag"), copy.text("cred3_tag"), copy.text("cred2_tag")].filter(Boolean).map((item) => (
            <span key={item} className="inline-flex items-start gap-2"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
