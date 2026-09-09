/**
 * Home page content resolver (core).
 *
 * Templates never read site_settings themselves: they receive a resolved copy
 * bag and resolved photographs. All fallback logic lives here, so every design
 * degrades the same way on a fresh clone (own value → default locale →
 * an older settings field → translated default → empty).
 */

import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { copyVars } from "@/lib/config/site-copy";
import type { SiteSettings } from "@/types/site-settings";

import type { HomeMediaSlot } from "./layout";

type LocaleMap = Record<string, unknown>;

function pick(map: unknown, locale: string, fallbackLocale: string): unknown {
  if (!map || typeof map !== "object") return undefined;
  const m = map as LocaleMap;
  return m[locale] ?? m[fallbackLocale] ?? Object.values(m)[0];
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);
}

/** Older settings fields keep working while a clone has no home_content yet. */
function legacyText(settings: SiteSettings, key: string, locale: string): string {
  const fb = settings.default_locale;
  switch (key) {
    case "hero_kicker":
      return settings.site_name ?? "";
    case "hero_headline":
      return asText(pick(settings.hero_headline, locale, fb));
    case "hero_subline":
      return asText(pick(settings.hero_subline, locale, fb));
    case "cred_intro":
      return asText(pick(settings.about_body, locale, fb));
    case "cred_title":
      return asText(pick(settings.credibility_heading, locale, fb));
    case "valuation_body": {
      const offer = pick(settings.valuation_offer, locale, fb) as
        | { body?: string }
        | undefined;
      return asText(offer?.body);
    }
    default:
      return "";
  }
}

function legacyList(settings: SiteSettings, key: string, locale: string): string[] {
  if (key !== "valuation_steps") return [];
  const offer = pick(settings.valuation_offer, locale, settings.default_locale) as
    | { deliverables?: unknown }
    | undefined;
  return asList(offer?.deliverables);
}

export interface HomeCopy {
  /** Resolved single string for a content key. */
  text: (key: string) => string;
  /** Resolved list for a list content key. */
  list: (key: string) => string[];
}

/**
 * Builds the copy bag for one locale. Translated defaults come from
 * the message files (`home.defaults.<key>`), so a fresh clone reads as a
 * finished page before the owner has written a single line.
 */
export function homeCopy(settings: SiteSettings, locale: string): HomeCopy {
  const content = (settings.home_content ?? {}) as Record<string, unknown>;
  const vars = copyVars(settings, locale);

  const raw = (key: string): unknown => pick(content[key], locale, settings.default_locale);

  return {
    text: (key) => {
      const own = asText(raw(key));
      if (own) return own;
      const legacy = legacyText(settings, key, locale);
      if (legacy) return legacy;
      const translated = translate(locale as Locale, `home.defaults.${key}`, vars);
      return translated === `home.defaults.${key}` ? "" : translated;
    },
    list: (key) => {
      const own = asList(raw(key));
      if (own.length > 0) return own;
      const legacy = legacyList(settings, key, locale);
      if (legacy.length > 0) return legacy;
      const translated = translate(locale as Locale, `home.defaults.${key}`, vars);
      return translated === `home.defaults.${key}` || !translated
        ? []
        : translated.split("\n").map((l) => l.trim()).filter(Boolean);
    },
  };
}

/** Per-slot photograph: an own upload wins, otherwise the house default. */
export function homeMedia(settings: SiteSettings, slot: HomeMediaSlot): string | null {
  const media = (settings.home_media ?? {}) as Record<
    string,
    { mode?: string; url?: string } | undefined
  >;
  const entry = media[slot];
  if (entry?.mode === "custom" && entry.url?.trim()) return entry.url.trim();

  const heroSection = (settings.homepage_sections ?? []).find((s) => s.key === "hero");
  const heroImage = heroSection?.image?.trim() || null;
  const portrait = settings.primary_agent_photo_url?.trim() || null;

  if (slot === "portrait") return portrait;
  return heroImage ?? portrait;
}

export interface HomeMediaBag {
  portrait: string | null;
  hero: string | null;
}

export function homeMediaBag(settings: SiteSettings): HomeMediaBag {
  return {
    portrait: homeMedia(settings, "portrait"),
    hero: homeMedia(settings, "hero_photo"),
  };
}
