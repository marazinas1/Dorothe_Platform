import { ContactSection } from "@/components/brand/ContactSection";
import { SoldStrip } from "@/components/brand/SoldStrip";

import { HomeListings } from "../HomeListings";
import { HomeTestimonials } from "../HomeTestimonials";
import type { HomeTemplateProps } from "../types";
import { H1Credentials } from "./H1Credentials";
import { H1Hero } from "./H1Hero";
import { H1Paths } from "./H1Paths";
import { H1Valuation } from "./H1Valuation";

/**
 * Design H1 — "direct": amber, ink and paper. Claim first, then the split,
 * qualification, client voices, and only then the properties.
 */
export function H1Home(props: HomeTemplateProps) {
  const { locale, settings, copy, featured, sold, hideSoldPrice } = props;
  return (
    <>
      <H1Hero {...props} />
      <H1Paths {...props} />
      <H1Credentials {...props} />
      <HomeTestimonials {...props} tone="paper" />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
      />
      <SoldStrip locale={locale} items={sold} settings={settings} hidePrice={hideSoldPrice} />
      <H1Valuation {...props} />
      <ContactSection locale={locale} settings={settings} heading={copy.text("contact_title")} />
    </>
  );
}
