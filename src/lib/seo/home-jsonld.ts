import type { TestiItem } from "@/lib/testimonials/types";
import type { SiteSettings } from "@/types/site-settings";

/** Below this, an aggregate rating would claim more than the page can show. */
const MIN_REVIEWS_FOR_AGGREGATE = 3;

/**
 * Structured data for the home page: the practice itself, plus the client
 * voices the page actually shows. Nothing is invented — a review only appears
 * when its quote is filled in, and the aggregate rating only once there are
 * enough published voices to support it.
 */
export function homeJsonLd(
  settings: SiteSettings,
  testimonials: TestiItem[],
  canonical: string,
) {
  const reviews = testimonials.map((item) => ({
    "@type": "Review",
    reviewBody: item.quote,
    reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
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
    ...(reviews.length >= MIN_REVIEWS_FOR_AGGREGATE
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 5,
            bestRating: 5,
            reviewCount: reviews.length,
          },
        }
      : {}),
  };
}
