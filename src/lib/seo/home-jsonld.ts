import type { HomeCopy } from "@/lib/home/content";
import { testiItems } from "@/components/brand/home/types";
import type { SiteSettings } from "@/types/site-settings";

/**
 * Structured data for the home page: the practice itself, plus the client
 * voices the page already shows. Identical for every design, so choosing a
 * design never changes what search engines understand about the business.
 * Nothing is invented — a review only appears when its quote is filled in.
 */
export function homeJsonLd(settings: SiteSettings, copy: HomeCopy, canonical: string) {
  const reviews = testiItems(copy).map((item) => ({
    "@type": "Review",
    reviewBody: item.quote,
    ...(item.name ? { author: { "@type": "Person", name: item.name } } : {}),
  }));

  const address = [settings.address_street, settings.address_zip, settings.address_city].filter(
    Boolean,
  );

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.site_name,
    url: canonical,
    ...(settings.legal_name ? { legalName: settings.legal_name } : {}),
    ...(settings.contact_email ? { email: settings.contact_email } : {}),
    ...(settings.contact_phone ? { telephone: settings.contact_phone } : {}),
    ...(address.length
      ? {
          address: {
            "@type": "PostalAddress",
            ...(settings.address_street ? { streetAddress: settings.address_street } : {}),
            ...(settings.address_zip ? { postalCode: settings.address_zip } : {}),
            ...(settings.address_city ? { addressLocality: settings.address_city } : {}),
            ...(settings.address_country ? { addressCountry: settings.address_country } : {}),
          },
        }
      : {}),
    ...(reviews.length ? { review: reviews } : {}),
  };
}
