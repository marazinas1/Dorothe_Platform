import { ContactSection } from "@/components/brand/ContactSection";
import { SoldStrip } from "@/components/brand/SoldStrip";

import { HomeListings } from "../HomeListings";
import type { HomeTemplateProps } from "../types";
import { H2Credentials } from "./H2Credentials";
import { H2Hero } from "./H2Hero";
import { H2Paths } from "./H2Paths";
import { H2Statement } from "./H2Statement";
import { H2Valuation } from "./H2Valuation";

/** Design H2 — "four walls": photographic opening, warm wine tones, one quote. */
export function H2Home(props: HomeTemplateProps) {
  const { locale, settings, copy, featured, sold, hideSoldPrice } = props;
  return (
    <>
      <H2Hero {...props} />
      <H2Statement {...props} />
      <H2Paths {...props} />
      <H2Credentials {...props} />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
        variant="feature"
      />
      <SoldStrip locale={locale} items={sold} settings={settings} hidePrice={hideSoldPrice} />
      <H2Valuation {...props} />
      <ContactSection locale={locale} settings={settings} heading={copy.text("contact_title")} />
    </>
  );
}
