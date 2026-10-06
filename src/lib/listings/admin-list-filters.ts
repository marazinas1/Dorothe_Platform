// Client-side filtering of the already-loaded admin listing list.
import type { AdminListingRow } from "./admin.functions";
import { pickLocalized } from "./format";

/** Status tabs above the listings table, in the order the broker works. */
export const LISTING_TABS = ["all", "live", "drafts", "coming_soon", "closed", "archived"] as const;
export type ListingTab = (typeof LISTING_TABS)[number];

const TAB_STATUSES: Record<Exclude<ListingTab, "all">, string[]> = {
  live: ["active", "reserved"],
  drafts: ["draft"],
  coming_soon: ["coming_soon"],
  closed: ["sold", "rented"],
  archived: ["archived"],
};

export type ListingFilters = {
  tab: ListingTab;
  search: string;
  dealType: string;
  propertyType: string;
};

export const EMPTY_FILTERS: ListingFilters = {
  tab: "all",
  search: "",
  dealType: "all",
  propertyType: "all",
};

export function inTab(row: AdminListingRow, tab: ListingTab): boolean {
  return tab === "all" || TAB_STATUSES[tab].includes(row.status);
}

export function sortListings(rows: AdminListingRow[]): AdminListingRow[] {
  return [...rows].sort((a, b) => {
    const order = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    if (order !== 0) return order;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

function matchesSearch(row: AdminListingRow, needle: string, locale: string): boolean {
  const q = needle.trim().toLowerCase();
  if (!q) return true;
  const title = pickLocalized(row.title, locale).toLowerCase();
  const city = (row.address_city ?? "").toLowerCase();
  const reference = (row.reference_code ?? "").toLowerCase();
  return title.includes(q) || city.includes(q) || reference.includes(q);
}

/** Rows matching search, type and deal filters (ignores the status tab). */
export function filterListings(
  rows: AdminListingRow[],
  filters: Omit<ListingFilters, "tab">,
  locale: string,
): AdminListingRow[] {
  return sortListings(
    rows.filter(
      (row) =>
        matchesSearch(row, filters.search, locale) &&
        (filters.dealType === "all" || row.deal_type === filters.dealType) &&
        (filters.propertyType === "all" || row.property_type === filters.propertyType),
    ),
  );
}
