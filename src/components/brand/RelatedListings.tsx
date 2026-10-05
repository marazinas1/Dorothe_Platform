import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { LISTING_CARD_GRID } from "@/lib/homepage/card-grid";
import type { PublicListing } from "@/lib/listings/queries.functions";
import type { SiteSettings } from "@/types/site-settings";

import { ListingCard } from "./ListingCard";

type Props = {
  items: PublicListing[];
  locale: Locale;
  settings: SiteSettings;
};

/**
 * Other properties that can actually be enquired about. The selection rules
 * (and why sold, rented and reserved are excluded) live in
 * src/lib/listings/related.ts; an empty selection hides the block entirely
 * rather than showing one card beside two gaps.
 */
export function RelatedListings({ items, locale, settings }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">
          {t("listings.detail.sections.related")}
        </h2>
        <a
          href={`/${locale}/immobilien`}
          className="eyebrow text-foreground underline underline-offset-8"
        >
          {t("listings.detail.all_properties")}
        </a>
      </div>
      {items.length > 0 ? (
        <div className={`mt-10 ${LISTING_CARD_GRID}`}>
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} locale={locale} settings={settings} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
