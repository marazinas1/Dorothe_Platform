/**
 * One grid definition for property cards on the homepage. Every block that
 * renders listing cards uses it, so the same component can never appear at
 * two different widths on one page.
 */
export const LISTING_CARD_GRID =
  "grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";

/**
 * Homepage sold proof-point block: two cards, but the row is capped well
 * below the page width so each card is narrower than an active listing card.
 */
export const SOLD_CARD_GRID =
  "grid max-w-[860px] grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2";

