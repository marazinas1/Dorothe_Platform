import type { Locale } from "@/i18n/config";
import type { HomeCopy, HomeMediaBag } from "@/lib/home/content";
import type { PublicListing } from "@/lib/listings/queries.functions";
import type { TestiItem } from "@/lib/testimonials/types";
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
  /** The curated client voices, already localised and capped. */
  testimonials: TestiItem[];
}


export interface FactItem {
  value: string;
  label: string;
}

/**
 * The small fact strip: one line per fact, written as "value — label" in the
 * admin. Anything without a separator becomes a label-less fact.
 */
export function factItems(copy: HomeCopy): FactItem[] {
  return copy
    .list("facts")
    .map((line) => {
      const [value, ...rest] = line.split("—");
      return { value: value.trim(), label: rest.join("—").trim() };
    })
    .filter((f) => f.value);
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
