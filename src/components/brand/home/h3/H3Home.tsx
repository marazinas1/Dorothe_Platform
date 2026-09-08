import { ContactSection } from "@/components/brand/ContactSection";
import { SoldStrip } from "@/components/brand/SoldStrip";

import { HomeListings } from "../HomeListings";
import type { HomeTemplateProps } from "../types";
import { H3Credentials } from "./H3Credentials";
import { H3Hero } from "./H3Hero";
import { H3Paths } from "./H3Paths";
import { H3Statement } from "./H3Statement";
import { H3Valuation } from "./H3Valuation";

/** Design H3 — "four walls": photographic opening, warm wine tones, one quote. */
export function H3Home(props: HomeTemplateProps) {
  const { locale, settings, copy, featured, sold, hideSoldPrice } = props;
  return (
    <>
      <H3Hero {...props} />
      <H3Statement {...props} />
      <H3Paths {...props} />
      <H3Credentials {...props} />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
        variant="feature"
      />
      <SoldStrip locale={locale} items={sold} settings={settings} hidePrice={hideSoldPrice} />
      <H3Valuation {...props} />
      <ContactSection locale={locale} settings={settings} heading={copy.text("contact_title")} />
    </>
  );
}
