/**
 * Editorial articles (core). One row per article, localised text, own address.
 */
export interface PostRow {
  id: string;
  slug: string;
  status: "draft" | "published";
  published_at: string | null;
  cover_path: string | null;
  cover_alt: Record<string, string> | null;
  title: Record<string, string> | null;
  excerpt: Record<string, string> | null;
  body: Record<string, string> | null;
  meta_title: Record<string, string> | null;
  meta_description: Record<string, string> | null;
  topic: PostTopic | null;
  created_at?: string;
  updated_at?: string;
}

export const POST_TOPICS = ["selling", "buying", "inheritance", "energy"] as const;
export type PostTopic = (typeof POST_TOPICS)[number];

/** What a presentational component receives — already localised. */
export interface PostView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string | null;
  coverAlt: string;
  publishedAt: string | null;
  metaTitle: string;
  metaDescription: string;
  topic: PostTopic | null;
}

export const POST_COLUMNS =
  "id, slug, status, published_at, cover_path, cover_alt, title, excerpt, body, meta_title, meta_description, topic, created_at, updated_at";
