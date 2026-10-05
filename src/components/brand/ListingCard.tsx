import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ListingCardCover } from "@/components/brand/ListingCardCover";
import { ListingCardPrice } from "@/components/brand/ListingCardPrice";
import { ListingCardSpecs } from "@/components/brand/ListingCardSpecs";
import { ListingIcon } from "@/components/brand/ui/ListingIcon";
import type { Locale } from "@/i18n/config";
import type { PublicListing } from "@/lib/listings/queries.functions";
import { listingDisplayName, listingHeadline } from "@/lib/listings/display-title";
import { cardTone } from "@/lib/listings/card-tone";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  listing: PublicListing;
  locale: Locale;
  settings: SiteSettings;
  /** `small` is the dense proof-point card (recently sold); others are equal. */
  size?: "large" | "compact" | "small";
  hidePrice?: boolean;
  eager?: boolean;
  /** `row` is the list-view variant: photo left, facts middle, price right. */
  layout?: "card" | "row";
  /** Archived proof cards are informative and do not open inactive detail pages. */
  archived?: boolean;
};

/**
 * The one listing card (broker listings reference). An <article> whose headline
 * link stretches over the whole surface, so the card is one tab stop.
 */
export function ListingCard({
  listing,
  locale,
  settings,
  size = "large",
  hidePrice = false,
  eager = false,
  layout = "card",
  archived = false,
}: Props) {
  const { t } = useTranslation();
  const headline = listingHeadline(listing, locale);
  const linkName = listingDisplayName(listing, locale, t);
  const tone = cardTone(listing, t);
  const small = size === "small";
  const rent = listing.deal_type === "rent";
  const where = [listing.address_city, rent && layout === "row" ? t("listings.for_rent") : null]
    .filter(Boolean)
    .join(", ");

  const titleContent = archived ? headline : (
    <Link
      to="/$locale/immobilien/$slug"
      params={{ locale, slug: listing.slug }}
      aria-label={headline ? undefined : linkName}
      className="before:absolute before:inset-0 before:z-10 before:content-[''] focus-visible:outline-none"
    >
      {headline}
    </Link>
  );

  const meta = (
    <div className="flex items-center gap-1.5">
      <ListingIcon name="pin" className="size-3.5 text-muted-foreground" />
      <span className="eyebrow truncate text-[11.5px] font-semibold text-muted-foreground">{where}</span>
    </div>
  );

  const cover = (
    <ListingCardCover
      images={listing.images}
      locale={locale}
      name={linkName}
      badge={tone.badge}
      muted={tone.closed}
      eager={eager}
    />
  );

  const specs = (
    <ListingCardSpecs listing={listing} areaUnit={settings.area_unit} locale={locale} compact={small} />
  );

  if (layout === "row") {
    return (
      <article className="group relative grid items-center gap-6 border-t border-border py-[18px] md:grid-cols-[280px_1fr_auto] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
        {cover}
        <div className="min-w-0">
          {meta}
          <h3 className="mt-1.5 font-heading text-[21px] font-bold leading-snug text-foreground transition-opacity duration-300 group-hover:opacity-70">
            {titleContent}
          </h3>
          <div className="mt-3">{specs}</div>
        </div>
        <ListingCardPrice listing={listing} locale={locale} currency={settings.currency} hidePrice={hidePrice} layout="row" />
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ring">
      {cover}
      <div className={cn("flex flex-1 flex-col", small ? "pt-3" : "pt-4")}>
        {meta}
        <h3
          className={cn(
            "mt-2 line-clamp-2 min-h-[2.56em] font-heading font-bold leading-[1.28] text-foreground transition-opacity duration-300 group-hover:opacity-70",
            small ? "text-base" : "text-[18px]",
          )}
          title={headline || undefined}
        >
          {titleContent}
        </h3>
        <div className={small ? "mt-2" : "mt-3"}>{specs}</div>
        <div className={cn("flex flex-1 flex-col", small ? "mt-3" : "mt-3.5")}>
          <ListingCardPrice
            listing={listing}
            locale={locale}
            currency={settings.currency}
            hidePrice={hidePrice}
            size={small ? "small" : "default"}
          />
        </div>
      </div>
    </article>
  );
}
