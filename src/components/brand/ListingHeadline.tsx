import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import type { PublicListing } from "@/lib/listings/queries.functions";
import { pickLocalized } from "@/lib/listings/format";

type Props = {
  listing: PublicListing;
  locale: Locale;
};

/**
 * Body prose for the detail page. The headline itself lives on the hero,
 * so this block carries the reference kicker, the location line and the
 * description paragraphs.
 */
export function ListingHeadline({ listing, locale }: Props) {
  const { t } = useTranslation();
  const description = pickLocalized(listing.description, locale);

  const locationLine =
    listing.geo_precision === "hidden"
      ? [listing.address_zip, listing.address_city].filter(Boolean).join(" ")
      : [listing.address_street, listing.address_zip, listing.address_city]
          .filter(Boolean)
          .join(" · ");

  const paragraphs = description
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold md:text-3xl">
        {t("listings.detail.about_property")}
      </h2>
      {paragraphs.length > 0 ? (
        <div className="mt-5 max-w-2xl space-y-5 text-[15px] leading-7 text-foreground/90">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
