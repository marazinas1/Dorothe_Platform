/** Stored copy and photographs for one static public page (core). */
export type PageLocalized = Record<string, string | string[]>;
export type PageMediaEntry = { mode: "default" | "custom"; url: string };

export interface PageContentRow {
  page: string;
  content: Record<string, PageLocalized>;
  media: Record<string, PageMediaEntry>;
}

export const PAGE_CONTENT_COLUMNS = "page, content, media";

/** What a public page component receives: resolved lines and lists. */
export interface ResolvedPage {
  text: (field: string) => string;
  lines: (field: string) => string[];
  media: (slot: string) => string | null;
}
