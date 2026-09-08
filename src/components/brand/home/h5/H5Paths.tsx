import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { HomeTemplateProps } from "../types";

/**
 * Two editorial columns, each opened by a heavy rule — the page reads like a
 * spread rather than two clickable boxes.
 */
export function H5Paths({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-[1220px] px-6 py-20 lg:px-8">
      <div className="grid gap-14 md:grid-cols-2">
        <Link
          to="/$locale/verkaufen"
          params={{ locale }}
          className="group border-t-2 border-foreground pt-5"
        >
          <div className="eyebrow text-accent">{t("home.path_sell_kicker")}</div>
          <h2 className="text-section-sm mt-3.5 max-w-[16ch] text-balance">
            {copy.text("sell_title")}
          </h2>
          <p className="mt-3.5 max-w-[40ch] leading-relaxed text-muted-foreground">
            {copy.text("sell_body")}
          </p>
          <span className="mt-5 inline-block border-b border-current pb-0.5 text-sm font-medium transition-opacity group-hover:opacity-70">
            {t("home.path_sell_cta")}
          </span>
        </Link>

        <Link
          to="/$locale/immobilien"
          params={{ locale }}
          className="group border-t-2 border-foreground pt-5"
        >
          <div className="eyebrow text-accent">{t("home.path_buy_kicker")}</div>
          <h2 className="text-section-sm mt-3.5 max-w-[16ch] text-balance">
            {copy.text("buy_title")}
          </h2>
          <p className="mt-3.5 max-w-[40ch] leading-relaxed text-muted-foreground">
            {copy.text("buy_body")}
          </p>
          <span className="mt-5 inline-block border-b border-current pb-0.5 text-sm font-medium transition-opacity group-hover:opacity-70">
            {t("home.path_buy_cta")}
          </span>
        </Link>
      </div>
    </section>
  );
}
