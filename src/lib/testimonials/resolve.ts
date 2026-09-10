import { pickLocalized } from "@/lib/listings/format";

import { HOME_TESTIMONIAL_LIMIT, type TestiItem, type TestimonialRow } from "./types";

/** Table rows -> presentational items for one locale. Empty quotes drop out. */
export function testiItems(rows: TestimonialRow[], locale: string): TestiItem[] {
  return rows
    .map((row) => ({
      quote: pickLocalized(row.quote, locale, "en"),
      name: row.author_name ?? "",
      town: row.author_detail ?? "",
    }))
    .filter((item) => item.quote.length > 0);
}

/**
 * What the home page shows: the marked ones first, then the rest. The section
 * displays three at a time and the others are reached by sliding sideways, so
 * the choice decides the order rather than hiding anything.
 */
export function homeTestiItems(rows: TestimonialRow[], locale: string): TestiItem[] {
  const marked = rows.filter((row) => row.show_on_home).slice(0, HOME_TESTIMONIAL_LIMIT);
  const markedIds = new Set(marked.map((row) => row.id));
  const rest = rows.filter((row) => !markedIds.has(row.id));
  return testiItems([...marked, ...rest], locale);
}
