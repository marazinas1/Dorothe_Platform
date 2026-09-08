import { useTranslation } from "react-i18next";

import { Signature } from "@/components/brand/Signature";

import { HomeButton, HomeTextLink } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * "Die Sachverständige" opening: a measured serif headline on the left, the one
 * portrait on the right, the expert's name directly under it. Calm, document-like.
 */
export function H2Hero({ locale, settings, copy, media }: HomeTemplateProps) {
  const { t } = useTranslation();
  const kicker = copy.text("hero_kicker");

  return (
    <section className="mx-auto max-w-[1240px] px-6 pt-16 pb-20 lg:px-8 lg:pt-20 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.85fr] lg:gap-[72px]">
        <div>
          {kicker ? <div className="eyebrow text-muted-foreground">{kicker}</div> : null}
          <h1 className="text-hero-split mt-5 max-w-[16ch] text-balance hyphens-auto">
            {copy.text("hero_headline")}
          </h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
            {copy.text("hero_subline")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung">
              {t("home.hero_cta")}
            </HomeButton>
            <HomeTextLink locale={locale} to="/$locale/immobilien">
              {t("home.hero_cta_secondary")}
            </HomeTextLink>
          </div>
        </div>

        <div>
          {media.hero ? (
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-media)] bg-muted">
              <img
                src={media.hero}
                alt={settings.primary_agent_name ?? settings.site_name}
                className="h-full w-full object-cover object-top"
                fetchPriority="high"
              />
            </div>
          ) : null}
          <div className="mt-5">
            <Signature name={settings.primary_agent_name} size="md" />
            {settings.primary_agent_role ? (
              <div className="mt-1 text-sm text-muted-foreground">
                {settings.primary_agent_role}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
