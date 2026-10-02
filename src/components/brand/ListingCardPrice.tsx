import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { energyClassOf, energyClassTone } from "@/lib/listings/energy-class";
import { formatPrice } from "@/lib/listings/format";
import type { PublicListing } from "@/lib/listings/queries.functions";
import { cn } from "@/lib/utils";

type Props = {
  listing: PublicListing;
  locale: Locale;
  currency: string;
  hidePrice?: boolean;
  /** `row` stacks the figures right-aligned for the list view. */
  layout?: "card" | "row";
  size?: "default" | "small";
};

function monthYear(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "de-DE", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Price + legally required energy class. Rentals lead with cold rent and show
 * warm rent beneath; flats for sale show Hausgeld; closed listings show the
 * month, never the price.
 */
export function ListingCardPrice({ listing, locale, currency, hidePrice, layout = "card", size = "default" }: Props) {
  const { t } = useTranslation();
  const money = (n: number | null | undefined) =>
    formatPrice(n, currency, locale, { onRequestLabel: t("listings.on_request") });
  const rent = listing.deal_type === "rent";
  const closed = listing.status === "sold" || listing.status === "rented";
  const onRequest = listing.price_on_request || listing.price == null;
  const energy = energyClassOf(listing.energy);

  let main: string;
  let sub: string | null = null;
  let muted = false;
  if (closed) {
    muted = true;
    main = listing.sold_at
      ? t(rent ? "listings.card.rented_in" : "listings.card.sold_in", { date: monthYear(listing.sold_at, locale) })
      : t(rent ? "listings.rented" : "listings.sold");
  } else if (hidePrice || onRequest) {
    muted = true;
    main = t("listings.on_request");
  } else {
    main = money(listing.price);
    if (rent) {
      sub = t("listings.card.cold_rent");
    } else if (listing.service_charge) {
      sub = t("listings.card.hausgeld", { amount: money(listing.service_charge) });
    }
  }
  const warm = rent && !closed && listing.total_rent ? t("listings.card.warm", { amount: money(listing.total_rent) }) : null;

  const chip = energy ? (
    <span
      title={`${t("listings.facts.energy_class")} ${energy}`}
      className={cn(
        "inline-grid h-6 min-w-[30px] place-items-center rounded-[var(--radius-button)] px-1.5 text-xs font-bold",
        energyClassTone(energy),
      )}
    >
      <span className="sr-only">{t("listings.facts.energy_class")} </span>
      {energy}
    </span>
  ) : (
    <span className="max-w-[9rem] text-right text-[11px] leading-tight text-muted-foreground">
      {t("listings.card.cert_pending")}
    </span>
  );

  const priceCls = cn(
    "font-heading font-bold tabular-figures leading-tight",
    muted ? "text-[17px] text-muted-foreground" : size === "small" ? "text-lg" : layout === "row" ? "text-2xl" : "text-[22px]",
  );

  if (layout === "row") {
    return (
      <div className="flex flex-col items-start gap-3 md:items-end md:text-right">
        <div>
          <div className={priceCls}>{main}</div>
          {sub ? <div className="mt-1 text-[12.5px] font-medium text-muted-foreground">{sub}</div> : null}
          {warm ? <div className="eyebrow mt-2 text-[11px] text-muted-foreground">{warm}</div> : null}
        </div>
        {chip}
      </div>
    );
  }

  return (
    <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-3.5">
      <div>
        <div className={priceCls}>{main}</div>
        {sub ? <div className="mt-1 text-[12.5px] font-medium text-muted-foreground">{sub}</div> : null}
        {warm ? <div className="eyebrow mt-1 text-[11px] text-muted-foreground">{warm}</div> : null}
      </div>
      {chip}
    </div>
  );
}
