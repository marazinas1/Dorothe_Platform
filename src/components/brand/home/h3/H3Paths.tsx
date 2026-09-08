import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { HomeTemplateProps } from "../types";

/** Two paths as typography under a rule — no cards, no fills. */
export function H3Paths({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 md:grid-cols-2 lg:gap-20 lg:px-10">
        <Link
          to="/$locale/verkaufen"
          params={{ locale }}
          className="group border-t border-foreground pt-6 transition-opacity duration-300 hover:opacity-70"
        >
          <div className="eyebrow text-accent">{t("home.path_sell_kicker")}</div>
          <h2 className="text-section-sm mt-4 max-w-[18ch] text-balance">
            {copy.text("sell_title")}
          </h2>
          <p className="mt-4 max-w-[42ch] leading-relaxed text-muted-foreground">
            {copy.text("sell_body")}
          </p>
          <span className="eyebrow mt-6 inline-block border-b-2 border-foreground pb-1">
            {t("home.path_sell_cta")}
          </span>
        </Link>

        <Link
          to="/$locale/immobilien"
          params={{ locale }}
          className="group border-t border-foreground pt-6 transition-opacity duration-300 hover:opacity-70"
        >
          <div className="eyebrow text-accent">{t("home.path_buy_kicker")}</div>
          <h2 className="text-section-sm mt-4 max-w-[18ch] text-balance">
            {copy.text("buy_title")}
          </h2>
          <p className="mt-4 max-w-[42ch] leading-relaxed text-muted-foreground">
            {copy.text("buy_body")}
          </p>
          <span className="eyebrow mt-6 inline-block border-b-2 border-foreground pb-1">
            {t("home.path_buy_cta")}
          </span>
        </Link>
      </div>
    </section>
  );
}
