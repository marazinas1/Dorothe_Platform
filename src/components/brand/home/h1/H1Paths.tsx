import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { HomeTemplateProps } from "../types";

/**
 * Two full-bleed panels sharing one edge: selling carries the dark weight,
 * buying sits on the quieter surface tone. No gap, no radius — the split reads
 * as one object cut in two.
 */
export function H1Paths({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border">
      <div className="grid lg:grid-cols-[1.3fr_1fr]">
        <Link
          to="/$locale/verkaufen"
          params={{ locale }}
          className="group flex min-h-[320px] flex-col justify-center bg-primary px-6 py-14 text-primary-foreground transition-opacity duration-300 hover:opacity-95 lg:px-14 lg:py-[72px]"
        >
          <div className="eyebrow opacity-70">{t("home.path_sell_kicker")}</div>
          <h2 className="text-section mt-4 max-w-[16ch] text-balance">
            {copy.text("sell_title")}
          </h2>
          <p className="mt-4 max-w-[42ch] leading-relaxed opacity-85">{copy.text("sell_body")}</p>
          <span className="eyebrow mt-7 w-fit border-b border-current pb-1">
            {t("home.path_sell_cta")}
          </span>
        </Link>

        <Link
          to="/$locale/immobilien"
          params={{ locale }}
          className="group flex min-h-[320px] flex-col justify-center bg-secondary px-6 py-14 transition-opacity duration-300 hover:opacity-90 lg:px-14 lg:py-[72px]"
        >
          <div className="eyebrow text-muted-foreground">{t("home.path_buy_kicker")}</div>
          <h2 className="text-section-sm mt-4 max-w-[16ch] text-balance">
            {copy.text("buy_title")}
          </h2>
          <p className="mt-4 max-w-[42ch] leading-relaxed text-muted-foreground">
            {copy.text("buy_body")}
          </p>
          <span className="eyebrow mt-7 w-fit border-b border-current pb-1">
            {t("home.path_buy_cta")}
          </span>
        </Link>
      </div>
    </section>
  );
}
