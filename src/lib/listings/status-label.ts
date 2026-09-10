// The one place that decides what a lifecycle state is called.
// A live listing is never called "active": it is "For sale" or "For rent",
// which is what the market — and the broker — actually says.
import type { ListingStatus } from "./admin-schema";

/** Translation key for the state of one listing. */
export function statusLabelKey(
  status: string | null | undefined,
  dealType?: string | null,
): string {
  const s = status ?? "draft";
  if (s === "active" && dealType) {
    return dealType === "rent" ? "listings.status.active_rent" : "listings.status.active_sale";
  }
  return `listings.status.${s}`;
}

/** Translation key for the button that moves a listing into a state. */
export function statusActionKey(
  target: ListingStatus | string,
  dealType?: string | null,
): string {
  if (target === "active" && dealType) {
    return dealType === "rent"
      ? "admin.listings.statusAction.active_rent"
      : "admin.listings.statusAction.active_sale";
  }
  return `admin.listings.statusAction.${target}`;
}
