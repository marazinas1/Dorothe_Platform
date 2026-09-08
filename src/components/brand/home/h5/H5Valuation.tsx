import { useTranslation } from "react-i18next";

import { HomeButton } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * The valuation offer as one amber card — the single place on the page where
 * the accent fills a whole surface, so it reads as the next real step.
 */
export function H5Valuation({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();
  const title = copy.text("valuation_title");
  const steps = copy.list("valuation_steps");
  if (!title && steps.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1220px] px-6 pb-20 lg:px-8 lg:pb-[88px]">
      <div className="grid items-center gap-12 rounded-[var(--radius)] bg-accent px-8 py-14 text-accent-foreground lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:px-14 lg:py-16">
        <div>
          <h2 className="text-section max-w-[12ch] text-balance">{title}</h2>
          <p className="mt-4 max-w-[38ch] leading-relaxed opacity-90">
            {copy.text("valuation_body")}
          </p>
          <div className="mt-7">
            <HomeButton
              locale={locale}
              to="/$locale/immobilienbewertung"
              className="bg-background text-foreground"
            >
              {t("home.valuation_cta")} →
            </HomeButton>
          </div>
        </div>

        {steps.length > 0 ? (
          <ul>
            {steps.map((step, i) => (
              <li
                key={i}
                className="border-t border-current/25 py-3.5 text-[14.5px] last:border-b opacity-95"
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
