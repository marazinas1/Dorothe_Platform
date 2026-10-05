import { useTranslation } from "react-i18next";
import { Phone } from "lucide-react";

import { HomeButton } from "../HomeActions";
import type { HomeTemplateProps } from "../types";
import { buttonClass } from "@/components/brand/ui/Button";

export function H1Valuation({ locale, copy, settings }: HomeTemplateProps) {
  const { t } = useTranslation();
  const title = copy.text("valuation_title");
  const steps = copy.list("valuation_steps");
  if (!title && steps.length === 0) return null;

  return (
    <section className="bg-primary py-[72px] text-primary-foreground lg:py-[96px]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 md:px-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <h2 className="text-section max-w-[13ch] text-balance">{title}</h2>
          <p className="mt-4.5 max-w-[40ch] leading-relaxed opacity-75">
            {copy.text("valuation_body")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <HomeButton
              locale={locale}
              to="/$locale/verkaufen"
              tone="on-dark"
            >
              {t("home.valuation_cta")}
            </HomeButton>
            {settings.contact_phone ? (
              <a href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`} className={buttonClass({ variant: "outline", inverse: true })}>
                <Phone className="size-4" />{settings.contact_phone}
              </a>
            ) : null}
          </div>
        </div>

        {steps.length > 0 ? (
          <ul className="border-t border-primary-foreground/20">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-3.5 border-b border-primary-foreground/20 py-4 text-[14.5px] opacity-85"
              >
                <span className="shrink-0 font-heading text-primary-foreground/70 tabular-figures">
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
