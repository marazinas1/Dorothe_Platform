import { useTranslation } from "react-i18next";

import { Signature } from "@/components/brand/Signature";

import { HomeButton, HomeTextLink } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * Direct opening: the claim on the left in the serif, the portrait on the right
 * with her name under it. Amber carries the one primary action, the second one
 * stays a plain underlined link — one button style per hierarchy level.
 */
export function H1Hero({ locale, settings, copy, media }: HomeTemplateProps) {
  const { t } = useTranslation();
  const kicker = copy.text("hero_kicker");

  return (
    <section className="mx-auto max-w-[1220px] px-6 pt-16 pb-20 lg:px-8 lg:pt-20 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-16">
        <div>
          {kicker ? <div className="eyebrow text-muted-foreground">{kicker}</div> : null}
          <h1 className="text-hero-split mt-5 max-w-[15ch] text-balance hyphens-auto">
            {copy.text("hero_headline")}
          </h1>
          <p className="mt-6 max-w-[44ch] text-[17px] leading-[1.62] text-muted-foreground">
            {copy.text("hero_subline")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung" tone="accent">
              {t("home.hero_cta")}
            </HomeButton>
            <HomeTextLink locale={locale} to="/$locale/immobilien">
              {t("home.hero_cta_secondary")}
            </HomeTextLink>
          </div>
        </div>

        <div>
          {media.hero ? (
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)] bg-secondary">
              <img
                src={media.hero}
                alt={settings.primary_agent_name ?? settings.site_name}
                className="h-full w-full object-cover object-top"
                fetchPriority="high"
              />
            </div>
          ) : null}
          <div className="mt-4">
            <Signature name={settings.primary_agent_name} size="md" />
            {settings.primary_agent_role ? (
              <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                {settings.primary_agent_role}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
