import { useTranslation } from "react-i18next";

import { pickLocalized } from "@/lib/listings/format";

import { HomeButton, HomeTextLink } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * "Saarland Modern" opening: no photograph competes with the sentence. The
 * headline is set as large as the grid allows, the supporting column carries the
 * actions, and the facts row states the credentials before the photo band.
 */
export function H4Hero({ locale, settings, copy, media }: HomeTemplateProps) {
  const { t } = useTranslation();
  const stats = settings.credibility_stats ?? [];

  return (
    <>
      <section className="border-b border-border pt-20 lg:pt-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="flex flex-col gap-10 pb-14 lg:flex-row lg:justify-between">
            <h1 className="max-w-[13ch] font-heading text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.03em] text-balance">
              {copy.text("hero_headline")}
            </h1>
            <div className="w-full shrink-0 pt-2 lg:w-[280px]">
              <p className="leading-relaxed text-muted-foreground">{copy.text("hero_subline")}</p>
              <div className="mt-6 flex flex-col items-start gap-3">
                <HomeButton locale={locale} to="/$locale/immobilienbewertung">
                  {t("home.hero_cta")}
                </HomeButton>
                <HomeTextLink locale={locale} to="/$locale/immobilien">
                  {t("home.hero_cta_secondary")}
                </HomeTextLink>
              </div>
            </div>
          </div>

          {stats.length > 0 ? (
            <div className="grid border-t border-border md:grid-cols-3">
              {stats.slice(0, 3).map((stat, i) => (
                <div
                  key={i}
                  className="border-b border-border py-6 pr-7 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="text-[15px] font-semibold">{stat.value}</div>
                  <div className="mt-1 text-[12.5px] text-muted-foreground">
                    {pickLocalized(stat.label, locale, settings.default_locale)}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {media.band ? (
        <div className="h-[56vh] max-h-[560px] min-h-[380px] w-full overflow-hidden bg-muted">
          <img
            src={media.band}
            alt={settings.primary_agent_name ?? settings.site_name}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>
      ) : null}
    </>
  );
}
