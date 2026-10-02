import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { buttonClass } from "@/components/brand/ui/Button";
import type { Locale } from "@/i18n/config";

export function ListingsNeedCta({ locale }: { locale: Locale }) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-24 pt-12 md:px-10">
      <div className="flex flex-col gap-7 bg-card px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <h2 className="font-heading text-xl font-bold">{t("listings.need_cta.title")}</h2>
          <p className="mt-2 max-w-[62ch] text-[15px] leading-6 text-muted-foreground">{t("listings.need_cta.body")}</p>
        </div>
        <Link
          to="/$locale/kontakt"
          params={{ locale }}
          className={buttonClass({ variant: "primary", size: "sm", className: "shrink-0" })}
        >
          {t("listings.need_cta.action")}
        </Link>
      </div>
    </section>
  );
}