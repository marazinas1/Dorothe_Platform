import { ContactSection } from "@/components/brand/ContactSection";
import { SoldStrip } from "@/components/brand/SoldStrip";

import { HomeListings } from "../HomeListings";
import { HomeTestimonials } from "../HomeTestimonials";
import type { HomeTemplateProps } from "../types";
import { H3Credentials } from "./H3Credentials";
import { H3Hero } from "./H3Hero";
import { H3Paths } from "./H3Paths";
import { H3Valuation } from "./H3Valuation";

/** Design H3 — "modern": one big sentence, hairline grids, orange accent. */
export function H3Home(props: HomeTemplateProps) {
  const { locale, settings, copy, featured, sold, hideSoldPrice } = props;
  return (
    <>
      <H3Hero {...props} />
      <H3Paths {...props} />
      <H3Credentials {...props} />
      <HomeTestimonials {...props} tone="ink" />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
      />
      <SoldStrip locale={locale} items={sold} settings={settings} hidePrice={hideSoldPrice} />
      <H3Valuation {...props} />
      <ContactSection locale={locale} settings={settings} heading={copy.text("contact_title")} />
    </>
  );
}
