/** Stored copy and photographs for one static public page (core). */
export interface PageContentRow {
  page: string;
  content: Record<string, unknown>;
  media: Record<string, unknown>;
}

export const PAGE_CONTENT_COLUMNS = "page, content, media";

/** What a public page component receives: resolved lines and lists. */
export interface ResolvedPage {
  text: (field: string) => string;
  lines: (field: string) => string[];
  media: (slot: string) => string | null;
}
