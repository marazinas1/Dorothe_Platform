import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { HomeTemplateProps } from "../types";

/**
 * Two panels sharing one edge: selling carries the ink weight, buying stays on
 * paper. The amber kicker is the only saturated mark in each panel.
 */
export function H1Paths({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();

  return (
    <section>
      <div className="grid md:grid-cols-2">
        <Link
          to="/$locale/verkaufen"
          params={{ locale }}
          className="flex min-h-[420px] flex-col justify-end bg-foreground px-6 py-16 text-background transition-opacity duration-300 hover:opacity-95 md:px-16 md:py-[88px]"
        >
          <div className="eyebrow text-primary-foreground/70">{t("home.path_sell_kicker")}</div>
          <h2 className="text-section-sm mt-3.5 max-w-[16ch] text-balance">
            {copy.text("sell_title")}
          </h2>
          <p className="mt-3.5 max-w-[40ch] leading-relaxed opacity-75">
            {copy.text("sell_body")}
          </p>
          <span className="mt-6 w-fit border-b border-current pb-0.5 text-sm font-medium">
            {t("home.path_sell_cta")}
          </span>
        </Link>

        <Link
          to="/$locale/immobilien"
          params={{ locale }}
          className="flex min-h-[420px] flex-col justify-end bg-card px-6 py-16 transition-colors duration-300 hover:bg-secondary md:px-16 md:py-[88px]"
        >
          <div className="eyebrow text-muted-foreground">{t("home.path_buy_kicker")}</div>
          <h2 className="text-section-sm mt-3.5 max-w-[16ch] text-balance">
            {copy.text("buy_title")}
          </h2>
          <p className="mt-3.5 max-w-[40ch] leading-relaxed text-muted-foreground">
            {copy.text("buy_body")}
          </p>
          <span className="mt-6 w-fit border-b border-current pb-0.5 text-sm font-medium">
            {t("home.path_buy_cta")}
          </span>
        </Link>
      </div>
    </section>
  );
}
