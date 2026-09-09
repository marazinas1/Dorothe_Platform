/**
 * Home page layout constants (core).
 *
 * One home page, one visual direction. Colours, typefaces and corner style
 * live in `site_settings` (Branding); this file only states the two chrome
 * decisions the home page makes and which photograph slots it offers.
 */

export type HomeMediaSlot = "portrait" | "hero_photo";

export const HOME_MEDIA_SLOTS: HomeMediaSlot[] = ["hero_photo", "portrait"];

export const HOME_CHROME = {
  /** The footer band is the darker, warmer surface. */
  footerTone: "dark" as const,
  /** The header does not sit on top of a full-bleed hero photograph. */
  heroOverlay: false,
};
