/**
 * Everything the listing card needs to know about a status, decided once.
 * Badge rule (broker listings reference): never more than one per card —
 * New, Coming soon, Reserved, Sold, Rented.
 */
export type CardBadgeTone = "accent" | "light" | "dark";
export type CardBadge = { label: string; tone: CardBadgeTone };

export type CardTone = {
  status: string;
  badge: CardBadge | null;
  /** Closed properties (sold, rented) read as archive, not as offer. */
  closed: boolean;
};

type ToneInput = {
  status: string;
  deal_type: string;
  published_at?: string | null;
};

/** A listing counts as new for this many days after publishing. */
const NEW_DAYS = 21;

function isNew(published: string | null | undefined): boolean {
  if (!published) return false;
  const age = Date.now() - new Date(published).getTime();
  return age >= 0 && age < NEW_DAYS * 86_400_000;
}

export function cardTone(listing: ToneInput, t: (key: string) => string): CardTone {
  const s = listing.status;
  if (s === "coming_soon") {
    const label = t("listings.coming_soon");
    return { status: label, badge: { label, tone: "light" }, closed: false };
  }
  if (s === "reserved") {
    const label = t("listings.reserved");
    return { status: label, badge: { label, tone: "light" }, closed: false };
  }
  if (s === "sold" || s === "rented") {
    const label = t(s === "sold" ? "listings.sold" : "listings.rented");
    return { status: label, badge: { label, tone: "dark" }, closed: true };
  }
  const status = t(listing.deal_type === "rent" ? "listings.for_rent" : "listings.for_sale");
  return {
    status,
    badge: isNew(listing.published_at) ? { label: t("listings.new"), tone: "accent" } : null,
    closed: false,
  };
}
