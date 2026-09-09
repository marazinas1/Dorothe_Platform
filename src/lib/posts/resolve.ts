import { pickLocalized } from "@/lib/listings/format";

import type { PostRow, PostView } from "./types";

/** One row -> presentational shape for one locale, with German fallback. */
export function postView(row: PostRow, locale: string): PostView {
  const title = pickLocalized(row.title, locale, "de");
  const excerpt = pickLocalized(row.excerpt, locale, "de");
  return {
    id: row.id,
    slug: row.slug,
    title,
    excerpt,
    body: pickLocalized(row.body, locale, "de"),
    cover: row.cover_path && row.cover_path.length > 0 ? row.cover_path : null,
    coverAlt: pickLocalized(row.cover_alt, locale, "de") || title,
    publishedAt: row.published_at,
    metaTitle: pickLocalized(row.meta_title, locale, "de") || title,
    metaDescription: pickLocalized(row.meta_description, locale, "de") || excerpt,
  };
}

export function postViews(rows: PostRow[], locale: string): PostView[] {
  return rows.map((row) => postView(row, locale)).filter((p) => p.title.length > 0);
}
