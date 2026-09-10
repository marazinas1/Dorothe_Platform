/**
 * Where the brand images live (core).
 *
 * One folder per asset kind inside the public `site-assets` bucket, so a
 * replaced logo overwrites the old file and every surface — public site and
 * admin panel — picks up the new one.
 */

export const SITE_ASSETS_BUCKET = "site-assets";

export type BrandAssetKind = "logo" | "logo_dark" | "favicon" | "og_default";

/** Stable path per asset kind, so uploads replace rather than pile up. */
export function brandAssetPath(kind: BrandAssetKind, variant: string): string {
  return `brand/${kind}-${variant}.webp`;
}

export function siteAssetUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${SITE_ASSETS_BUCKET}/${path}`;
}

/**
 * Stable path for a page photograph slot, so replacing a picture overwrites the
 * old file instead of piling up copies.
 */
export function pageMediaPath(scope: string, slot: string): string {
  const safe = (v: string) => v.replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
  return `pages/${safe(scope)}-${safe(slot)}.webp`;
}
