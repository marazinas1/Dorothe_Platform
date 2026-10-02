import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import type { Step } from "@/components/brand/NumberedSteps";
import { HomeTextLink } from "../HomeActions";

export function H1SaleProcess({ locale, steps }: { locale: Locale; steps: Step[] }) {
  const { t } = useTranslation();
  if (steps.length === 0) return null;

  return (
    <section className="bg-card py-[72px] lg:py-[88px]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-section max-w-[22ch] text-balance">{t("home.sale_process_title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("home.sale_process_intro")}</p>
          </div>
          <HomeTextLink locale={locale} to="/$locale/verkaufen">{t("home.sale_process_link")}</HomeTextLink>
        </div>
        <ol className="grid border-t border-border md:grid-cols-4">
          {steps.slice(0, 4).map((step, index) => (
            <li key={step.title} className="border-b border-border py-7 md:min-h-[220px] md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <div className="font-heading text-[34px] font-bold tabular-figures">{index + 1}</div>
              <h3 className="mt-4 font-heading text-xl font-bold leading-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}