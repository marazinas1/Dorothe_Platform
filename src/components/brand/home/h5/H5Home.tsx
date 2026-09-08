import { ContactSection } from "@/components/brand/ContactSection";
import { SoldStrip } from "@/components/brand/SoldStrip";

import { HomeListings } from "../HomeListings";
import { HomeTestimonials } from "../HomeTestimonials";
import type { HomeTemplateProps } from "../types";
import { H5Credentials } from "./H5Credentials";
import { H5Facts } from "./H5Facts";
import { H5Hero } from "./H5Hero";
import { H5Paths } from "./H5Paths";
import { H5Valuation } from "./H5Valuation";

/**
 * Design H5 — "editorial": a full-screen photographic opening, a fact strip,
 * an inverted band of client voices mid-page, and an amber valuation card.
 */
export function H5Home(props: HomeTemplateProps) {
  const { locale, settings, copy, featured, sold, hideSoldPrice } = props;
  return (
    <>
      <H5Hero {...props} />
      <H5Facts {...props} />
      <H5Paths {...props} />
      <H5Credentials {...props} />
      <HomeTestimonials {...props} tone="ink" />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
        variant="feature"
      />
      <SoldStrip locale={locale} items={sold} settings={settings} hidePrice={hideSoldPrice} />
      <H5Valuation {...props} />
      <ContactSection locale={locale} settings={settings} heading={copy.text("contact_title")} />
    </>
  );
}
