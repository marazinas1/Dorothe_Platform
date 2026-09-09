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

/** The curated set the home page shows: marked for home, capped. */
export function homeTestiItems(rows: TestimonialRow[], locale: string): TestiItem[] {
  return testiItems(
    rows.filter((row) => row.show_on_home),
    locale,
  ).slice(0, HOME_TESTIMONIAL_LIMIT);
}
