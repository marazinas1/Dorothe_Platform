import { useTranslation } from "react-i18next";

import { HomeButton } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/** The valuation offer as a single raised card on the paper surface. */
export function H3Valuation({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();
  const title = copy.text("valuation_title");
  const steps = copy.list("valuation_steps");
  if (!title && steps.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1220px] px-6 py-20 lg:px-8 lg:py-24">
      <div className="grid gap-12 rounded-[var(--radius-media)] bg-secondary px-8 py-12 md:grid-cols-2 lg:px-14 lg:py-16">
        <div>
          <h2 className="text-section max-w-[16ch] text-balance">{title}</h2>
          <p className="mt-5 max-w-[42ch] leading-relaxed text-muted-foreground">
            {copy.text("valuation_body")}
          </p>
          <div className="mt-8">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung">
              {t("home.valuation_cta")}
            </HomeButton>
          </div>
        </div>
        {steps.length > 0 ? (
          <ul className="self-center">
            {steps.map((step, i) => (
              <li
                key={i}
                className="border-b border-border py-4 text-[15px] leading-relaxed last:border-b-0"
              >
                {step}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
