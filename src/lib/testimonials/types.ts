/**
 * Client voices (core). One row per quote, localised, ordered by the owner.
 */
export interface TestimonialRow {
  id: string;
  quote: Record<string, string> | null;
  author_name: string;
  author_detail: string;
  sort_order: number;
  published: boolean;
  show_on_home: boolean;
}

/** What a presentational component receives — already localised. */
export interface TestiItem {
  quote: string;
  name: string;
  town: string;
}

/** How many quotes the home page ever shows. */
export const HOME_TESTIMONIAL_LIMIT = 3;
