import { useTranslation } from "react-i18next";

import { HomeButton } from "../HomeActions";
import type { HomeTemplateProps } from "../types";

/**
 * The mandate band: the only inverted full-width area on the page, so the
 * valuation offer cannot be scrolled past. On ink the primary action turns
 * paper-coloured — amber on ink reads like a mistake, not a choice.
 */
export function H1Valuation({ locale, copy }: HomeTemplateProps) {
  const { t } = useTranslation();
  const title = copy.text("valuation_title");
  const steps = copy.list("valuation_steps");
  if (!title && steps.length === 0) return null;

  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-[88px]">
      <div className="mx-auto grid max-w-[1220px] items-center gap-12 px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-8">
        <div>
          <h2 className="text-section max-w-[13ch] text-balance">{title}</h2>
          <p className="mt-4.5 max-w-[40ch] leading-relaxed opacity-75">
            {copy.text("valuation_body")}
          </p>
          <div className="mt-7">
            <HomeButton
              locale={locale}
              to="/$locale/immobilienbewertung"
              tone="on-dark"
            >
              {t("home.valuation_cta")}
            </HomeButton>
          </div>
        </div>

        {steps.length > 0 ? (
          <ul className="border-t border-primary-foreground/20">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-3.5 border-b border-primary-foreground/20 py-4 text-[14.5px] opacity-85"
              >
                <span className="shrink-0 font-heading text-accent italic tabular-figures">
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
