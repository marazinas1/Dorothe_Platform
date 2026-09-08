import { ContactSection } from "@/components/brand/ContactSection";
import { SoldStrip } from "@/components/brand/SoldStrip";

import { HomeListings } from "../HomeListings";
import type { HomeTemplateProps } from "../types";
import { H1Credentials } from "./H1Credentials";
import { H1Hero } from "./H1Hero";
import { H1Paths } from "./H1Paths";
import { H1Valuation } from "./H1Valuation";

/** Design H1 — "the expert": paper tones, serif headlines, document rhythm. */
export function H1Home(props: HomeTemplateProps) {
  const { locale, settings, copy, featured, sold, hideSoldPrice } = props;
  return (
    <>
      <H1Hero {...props} />
      <H1Paths {...props} />
      <H1Credentials {...props} />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
      />
      <SoldStrip
        locale={locale}
        items={sold}
        settings={settings}
        hidePrice={hideSoldPrice}
      />
      <H1Valuation {...props} />
      <ContactSection locale={locale} settings={settings} heading={copy.text("contact_title")} />
    </>
  );
}
