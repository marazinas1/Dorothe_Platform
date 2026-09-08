import { useTranslation } from "react-i18next";

import { HomeButton } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/** The valuation offer as a numbered process, stated flat on the page. */
export function H4Valuation({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();
  const title = copy.text("valuation_title");
  const steps = copy.list("valuation_steps");
  if (!title && steps.length === 0) return null;

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 md:grid-cols-2 lg:gap-20 lg:px-10">
        <div>
          <h2 className="text-section max-w-[16ch] text-balance">{title}</h2>
          <p className="mt-5 max-w-[44ch] leading-relaxed text-muted-foreground">
            {copy.text("valuation_body")}
          </p>
          <div className="mt-8">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung">
              {t("home.valuation_cta")}
            </HomeButton>
          </div>
        </div>
        {steps.length > 0 ? (
          <div className="self-center">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-5 border-t border-border py-5 text-[15px] last:border-b last:border-border"
              >
                <span className="font-semibold tabular-figures text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
