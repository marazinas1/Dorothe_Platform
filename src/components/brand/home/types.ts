import type { Locale } from "@/i18n/config";
import type { HomeCopy, HomeMediaBag } from "@/lib/home/content";
import type { PublicListing } from "@/lib/listings/queries.functions";
import type { SiteSettings } from "@/types/site-settings";

/**
 * Every home page design receives exactly this: resolved copy, resolved
 * photographs and the listings already filtered by the price policy. Designs
 * are presentation only — they never read settings or fetch anything.
 */
export interface HomeTemplateProps {
  locale: Locale;
  settings: SiteSettings;
  copy: HomeCopy;
  media: HomeMediaBag;
  featured: PublicListing[];
  sold: PublicListing[];
  hideSoldPrice: boolean;
}

export interface CredItem {
  title: string;
  body: string;
  tag: string;
}

/** The three credential columns, in the order the owner filled them in. */
export function credItems(copy: HomeCopy): CredItem[] {
  return [1, 2, 3]
    .map((n) => ({
      title: copy.text(`cred${n}_title`),
      body: copy.text(`cred${n}_body`),
      tag: copy.text(`cred${n}_tag`),
    }))
    .filter((item) => item.title || item.body);
}
