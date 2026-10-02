import { useTranslation } from "react-i18next";

import { HomeButton } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * Full-bleed seller-first opening from the approved broker-site reference.
 */
export function H1Hero({ locale, copy, media }: HomeTemplateProps) {
  const { t } = useTranslation();
  const kicker = copy.text("hero_kicker");

  return (
    <section className="relative flex min-h-[max(680px,calc(100svh-80px))] items-end overflow-hidden bg-foreground text-on-media">
      {media.hero ? (
        <img
          src={media.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      ) : null}
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pt-32 pb-14 md:px-10">
        <div>
          {kicker ? <div className="eyebrow text-on-media-muted">{kicker}</div> : null}
          <h1 className="mt-5 max-w-[15ch] text-balance text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-bold hyphens-auto text-on-media">
            {copy.text("hero_headline")}
          </h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.55] text-on-media-muted">
            {copy.text("hero_subline")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung" tone="on-dark">
              {t("home.hero_cta")}
            </HomeButton>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-9 gap-y-3 border-t border-on-media/25 pt-6 text-sm text-on-media-muted">
          {[copy.text("cred1_tag"), copy.text("cred3_tag")].filter(Boolean).map((item) => (
            <span key={item} className="inline-flex items-center gap-2"><span aria-hidden="true">✓</span>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
