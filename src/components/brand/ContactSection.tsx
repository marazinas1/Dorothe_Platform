import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useFeatureFlag } from "@/hooks/use-feature-flag";
import type { Locale } from "@/i18n/config";
import { SECTION_GAP } from "@/lib/homepage/rhythm";
import type { SiteSettings } from "@/types/site-settings";

import { ShortInquiryForm } from "./ShortInquiryForm";

type Props = {
  locale: Locale;
  settings: SiteSettings;
  /** Owner-written heading; falls back to the translated default. */
  heading?: string;
  appearance?: "default" | "direct";
};

type Tab = "buyer" | "seller";

/**
 * Homepage contact section — two lead paths (buyer / seller) plus the
 * broker's direct contact details. Never a single generic "contact us" form.
 * Headline switches between solo and team wording based on the `team`
 * feature flag so an agency still reads correctly.
 */
export function ContactSection({ locale, settings, heading, appearance = "default" }: Props) {
  const { t } = useTranslation();
  const teamEnabled = useFeatureFlag("team");
  const [tab, setTab] = useState<Tab>("seller");

  if (appearance === "direct") {
    return (
      <section className="mx-auto max-w-[1220px] px-6 py-20 lg:px-8 lg:py-[88px]">
        <div className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-[60px]">
          <div>
            <h2 className="max-w-[11ch] font-heading text-[clamp(1.7rem,2.6vw,2.2rem)] leading-[1.18]">
              {heading || t(teamEnabled ? "home.contact_headline" : "home.contact_headline_solo")}
            </h2>
            <div className="mt-6 text-[15px] leading-8 text-muted-foreground">
              {settings.contact_email ? <a href={`mailto:${settings.contact_email}`} className="block hover:text-foreground">{settings.contact_email}</a> : null}
              {settings.contact_phone ? <div className="tabular-figures">{settings.contact_phone}</div> : null}
              {settings.address_street ? <div className="mt-4">{settings.address_street}<br />{settings.address_zip} {settings.address_city}</div> : null}
            </div>
          </div>
          <div>
            <div role="tablist" className="flex gap-6 border-b border-border">
              <DirectTab active={tab === "seller"} onClick={() => setTab("seller")}>{t("inquiry.seller.tab")}</DirectTab>
              <DirectTab active={tab === "buyer"} onClick={() => setTab("buyer")}>{t("inquiry.buyer.tab")}</DirectTab>
            </div>
            <div className="mt-6"><ShortInquiryForm key={tab} mode={tab} locale={locale} /></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`mx-auto ${SECTION_GAP.normal} max-w-[1400px] px-6 pb-20 lg:px-10 lg:pb-24`}>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {t("home.contact")}
          </div>
          <h2 className="text-section-sm mt-6">
            {heading || t(teamEnabled ? "home.contact_headline" : "home.contact_headline_solo")}
          </h2>

          <div className="mt-10 space-y-2 text-base text-foreground">
            {settings.contact_email ? (
              <div>
                <a className="hover:opacity-70" href={`mailto:${settings.contact_email}`}>
                  {settings.contact_email}
                </a>
              </div>
            ) : null}
            {settings.contact_phone ? (
              <div className="tabular-figures">{settings.contact_phone}</div>
            ) : null}
            {settings.address_street ? (
              <div className="pt-4 text-sm text-muted-foreground">
                {settings.address_street}
                <br />
                {settings.address_zip} {settings.address_city}
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-8">
          <div role="tablist" className="flex gap-10 border-b border-border">
            {/* Selling first, and selected by default: the seller is the visitor
                whose decision this page is trying to win. */}
            <TabButton active={tab === "seller"} onClick={() => setTab("seller")}>
              {t("inquiry.seller.tab")}
            </TabButton>
            <TabButton active={tab === "buyer"} onClick={() => setTab("buyer")}>
              {t("inquiry.buyer.tab")}
            </TabButton>
          </div>

          <div className="mt-12">
            <ShortInquiryForm key={tab} mode={tab} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DirectTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`-mb-px border-b-2 pb-2.5 text-[14.5px] ${active ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground"}`}>{children}</button>;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative -mb-px pb-4 font-heading text-xl transition-opacity duration-300 md:text-2xl ${
        active
          ? "text-foreground after:absolute after:inset-x-0 after:bottom-[-1px] after:h-px after:bg-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
