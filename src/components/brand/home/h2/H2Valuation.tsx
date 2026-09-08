import { useTranslation } from "react-i18next";

import { HomeButton } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * The mandate band: the only inverted full-width area on the page, so the
 * valuation offer is impossible to scroll past. Steps are numbered because a
 * seller wants to know what actually happens, not a promise.
 */
export function H2Valuation({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();
  const title = copy.text("valuation_title");
  const steps = copy.list("valuation_steps");
  if (!title && steps.length === 0) return null;

  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-24">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <h2 className="text-section max-w-[14ch] text-balance">{title}</h2>
          <p className="mt-5 max-w-[42ch] leading-relaxed opacity-80">
            {copy.text("valuation_body")}
          </p>
          <div className="mt-8">
            <HomeButton locale={locale} to="/$locale/immobilienbewertung">
              {t("home.valuation_cta")}
            </HomeButton>
          </div>
        </div>

        {steps.length > 0 ? (
          <ul className="border-b border-primary-foreground/20">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 border-t border-primary-foreground/20 py-[18px] text-[15px] opacity-85"
              >
                <span className="font-heading text-accent tabular-figures">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
