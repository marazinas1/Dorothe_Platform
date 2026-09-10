import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/listings/format";

/**
 * GDPR-friendly raster basemap: OpenStreetMap standard tiles, served
 * straight from the OSM tile servers. No API key, no Google, no tracking
 * cookies. (CARTO's light tiles started demanding an API key, which showed
 * as an "API KEY REQUIRED" watermark, so we use OSM directly.)
 */
export const OSM_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: "carto", type: "raster" as const, source: "carto" }],
};

/** Sage marker colour — kept in sync with the brand accent token. */
export const MARKER_COLOR = "#6B7259";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  /** "exact" renders a pin, "approximate" a soft area. */
  precision: "exact" | "approximate";
  title?: string;
  meta?: string;
  href?: string;
};

type ListingLike = {
  id: string;
  slug: string;
  geo_lat: number | null;
  geo_lng: number | null;
  geo_precision: string | null;
  title: any;
};

/**
 * Turn public listings into map points. Listings without coordinates —
 * which includes every `hidden` listing, since the public view nulls the
 * geo columns for those — are simply dropped.
 */
export function listingsToPoints(
  listings: ListingLike[],
  locale: Locale,
  opts: { metaFor?: (l: any) => string } = {},
): MapPoint[] {
  const points: MapPoint[] = [];
  for (const l of listings) {
    if (l.geo_lat == null || l.geo_lng == null) continue;
    if (l.geo_precision !== "exact" && l.geo_precision !== "approximate") continue;
    points.push({
      id: l.id,
      lat: Number(l.geo_lat),
      lng: Number(l.geo_lng),
      precision: l.geo_precision,
      title: pickLocalized(l.title, locale) || l.slug,
      meta: opts.metaFor?.(l),
      href: `/${locale}/immobilien/${l.slug}`,
    });
  }
  return points;
}
