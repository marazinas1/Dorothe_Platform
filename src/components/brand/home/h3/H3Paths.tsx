import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { HomeTemplateProps } from "../types";

/** Two soft-cornered panels, the selling path filled, the buying path open. */
export function H3Paths({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-[1220px] px-6 pb-20 lg:px-8 lg:pb-24">
      <div className="grid overflow-hidden rounded-[var(--radius-media)] border border-border md:grid-cols-2">
        <Link
          to="/$locale/verkaufen"
          params={{ locale }}
          className="bg-primary px-8 py-12 text-primary-foreground transition-opacity duration-300 hover:opacity-95 lg:px-11 lg:py-13"
        >
          <div className="font-heading text-base italic text-accent">
            {t("home.path_sell_kicker")}
          </div>
          <h2 className="text-section-sm mt-4 max-w-[16ch] text-balance">
            {copy.text("sell_title")}
          </h2>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed opacity-85">
            {copy.text("sell_body")}
          </p>
          <span className="eyebrow mt-6 inline-block border-b border-current pb-1">
            {t("home.path_sell_cta")}
          </span>
        </Link>

        <Link
          to="/$locale/immobilien"
          params={{ locale }}
          className="border-t border-border bg-background px-8 py-12 transition-colors duration-300 hover:bg-secondary md:border-l md:border-t-0 lg:px-11"
        >
          <div className="font-heading text-base italic text-accent">
            {t("home.path_buy_kicker")}
          </div>
          <h2 className="text-section-sm mt-4 max-w-[16ch] text-balance">
            {copy.text("buy_title")}
          </h2>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-muted-foreground">
            {copy.text("buy_body")}
          </p>
          <span className="eyebrow mt-6 inline-block border-b border-current pb-1">
            {t("home.path_buy_cta")}
          </span>
        </Link>
      </div>
    </section>
  );
}
