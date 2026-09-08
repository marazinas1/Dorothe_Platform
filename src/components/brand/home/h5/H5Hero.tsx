import { useTranslation } from "react-i18next";

import { HomeButton, HomeTextLink } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * Editorial opening: one full-bleed photograph, the claim sitting in its lower
 * band behind a protective gradient. Nothing else competes with the image.
 */
export function H5Hero({ locale, settings, copy, media }: HomeTemplateProps) {
  const { t } = useTranslation();
  const kicker = copy.text("hero_kicker");

  return (
    <section className="relative h-[82vh] min-h-[580px] w-full overflow-hidden bg-secondary">
      {media.hero ? (
        <img
          src={media.hero}
          alt={settings.primary_agent_name ?? settings.site_name}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1220px] px-6 pb-14 lg:px-8 lg:pb-16">
        <div className="max-w-[620px] text-white">
          {kicker ? <div className="eyebrow text-white/75">{kicker}</div> : null}
          <h1 className="text-hero-split mt-4 text-balance hyphens-auto">
            {copy.text("hero_headline")}
          </h1>
          <p className="mt-5 max-w-[44ch] text-[16.5px] leading-relaxed text-white/80">
            {copy.text("hero_subline")}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung" tone="accent">
              {t("home.hero_cta")}
            </HomeButton>
            <HomeTextLink locale={locale} to="/$locale/immobilien" className="text-white">
              {t("home.hero_cta_secondary")}
            </HomeTextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
