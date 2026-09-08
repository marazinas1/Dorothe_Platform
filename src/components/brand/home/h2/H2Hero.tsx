import { useTranslation } from "react-i18next";

import { HomeButton, HomeTextLink } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * "Vier Wände" opening: one full-bleed photograph with the promise set into its
 * lower band. The gradient exists only so the type stays readable — no other
 * decoration sits on the image.
 */
export function H2Hero({ locale, settings, copy, media }: HomeTemplateProps) {
  const { t } = useTranslation();
  const kicker = copy.text("hero_kicker");

  return (
    <section className="relative h-[88vh] min-h-[620px] w-full overflow-hidden bg-muted">
      {media.hero ? (
        <img
          src={media.hero}
          alt={settings.primary_agent_name ?? settings.site_name}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      ) : null}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1220px] px-6 pb-16 lg:px-8">
        <div className="max-w-[640px] text-white">
          {kicker ? <div className="eyebrow opacity-80">{kicker}</div> : null}
          <h1 className="text-hero-split mt-4 text-balance italic">{copy.text("hero_headline")}</h1>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed opacity-85">
            {copy.text("hero_subline")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung">
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
