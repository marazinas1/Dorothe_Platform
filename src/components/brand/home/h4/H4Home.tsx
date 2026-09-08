import { ContactSection } from "@/components/brand/ContactSection";
import { SoldStrip } from "@/components/brand/SoldStrip";

import { HomeListings } from "../HomeListings";
import type { HomeTemplateProps } from "../types";
import { H4Credentials } from "./H4Credentials";
import { H4Hero } from "./H4Hero";
import { H4Paths } from "./H4Paths";
import { H4Valuation } from "./H4Valuation";

/** Design H4 — "modern": one big sentence, hairline grids, orange accent. */
export function H4Home(props: HomeTemplateProps) {
  const { locale, settings, copy, featured, sold, hideSoldPrice } = props;
  return (
    <>
      <H4Hero {...props} />
      <H4Paths {...props} />
      <H4Credentials {...props} />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
      />
      <SoldStrip locale={locale} items={sold} settings={settings} hidePrice={hideSoldPrice} />
      <H4Valuation {...props} />
      <ContactSection locale={locale} settings={settings} heading={copy.text("contact_title")} />
    </>
  );
}
