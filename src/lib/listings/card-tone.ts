/**
 * Everything the listing card needs to know about a status, decided once.
 *
 * The card components never test `status` themselves: the eyebrow label, the
 * badge over the photograph, whether the media is muted and whether a price
 * row is shown all come from here, so the homepage, the catalogue, the sold
 * archive and the admin grid can never drift apart.
 */
export type CardBadge = { label: string; accent: boolean };

export type CardTone = {
  /** Short status word for the eyebrow row. */
  status: string;
  /** Shown over the photograph only for states a buyer must notice. */
  badge: CardBadge | null;
  /** Closed properties (sold, rented) read as archive, not as offer. */
  closed: boolean;
};

type ToneInput = {
  status: string;
  deal_type: string;
};

export function cardTone(listing: ToneInput, t: (key: string) => string): CardTone {
  if (listing.status === "coming_soon") {
    const label = t("listings.coming_soon");
    return { status: label, badge: { label, accent: true }, closed: false };
  }
  if (listing.status === "reserved") {
    const label = t("listings.reserved");
    return { status: label, badge: { label, accent: false }, closed: false };
  }
  if (listing.status === "sold") {
    const label = t("listings.sold");
    return { status: label, badge: { label, accent: false }, closed: true };
  }
  if (listing.status === "rented") {
    const label = t("listings.rented");
    return { status: label, badge: { label, accent: false }, closed: true };
  }
  return {
    status: t(listing.deal_type === "rent" ? "listings.for_rent" : "listings.for_sale"),
    badge: null,
    closed: false,
  };
}
