import brokerPlaceholder from "@/assets/noir-broker-portrait.jpg";
import homeHouse from "@/assets/noir-home-house.jpg";
import inheritanceHouse from "@/assets/noir-inheritance-house.jpg";
import sellingHouse from "@/assets/noir-selling-house.jpg";
import type { SiteSettings } from "@/types/site-settings";

/**
 * The finite catalogue of editable page photographs. Every slot resolves in
 * three layers: the owner's choice, then the studio default a developer
 * pinned, then the built-in code fallback.
 */
export const MEDIA_SLOTS = {
  "home:hero_photo": { page: "home", slot: "hero_photo", aspect: "aspect-[16/9]" },
  "selling:hero_photo": { page: "selling", slot: "hero_photo", aspect: "aspect-[4/3]" },
  "inheritance:hero_photo": { page: "inheritance", slot: "hero_photo", aspect: "aspect-[4/3]" },
  "about:portrait": { page: "about", slot: "portrait", aspect: "aspect-[4/5]" },
} as const;

export type MediaSlotKey = keyof typeof MEDIA_SLOTS;

/** Built-in portrait used when nobody chose one. */
export const BUILT_IN_PORTRAIT: string = brokerPlaceholder;

export type MediaSource = "chosen" | "default" | "builtIn";

export interface ResolvedMedia {
  chosen: string | null;
  studio: string | null;
  builtIn: string | null;
  url: string | null;
  source: MediaSource;
}

const clean = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

function studioDefault(settings: SiteSettings, key: MediaSlotKey): string | null {
  const bag = (settings.media_defaults ?? {}) as Record<string, unknown>;
  return clean(bag[key]);
}

function ownerChoice(settings: SiteSettings, key: MediaSlotKey): string | null {
  if (key === "about:portrait") return clean(settings.primary_agent_photo_url);
  if (key !== "home:hero_photo") return null;
  const media = (settings.home_media ?? {}) as Record<string, { mode?: string; url?: string } | undefined>;
  const entry = media.hero_photo;
  return entry?.mode === "custom" ? clean(entry.url) : null;
}

function builtIn(settings: SiteSettings, key: MediaSlotKey): string | null {
  if (key === "about:portrait") return BUILT_IN_PORTRAIT;
  if (key === "selling:hero_photo") return sellingHouse;
  if (key === "inheritance:hero_photo") return inheritanceHouse;
  return homeHouse;
}

export function resolveMedia(
  settings: SiteSettings,
  key: MediaSlotKey,
  overrides: { chosen?: string | null } = {},
): ResolvedMedia {
  const chosen = overrides.chosen !== undefined ? clean(overrides.chosen) : ownerChoice(settings, key);
  const studio = studioDefault(settings, key);
  const fallback = builtIn(settings, key);
  const source: MediaSource = chosen ? "chosen" : studio ? "default" : "builtIn";
  return { chosen, studio, builtIn: fallback, url: chosen ?? studio ?? fallback, source };
}

/** The agent portrait every public placement shows. */
export function agentPortrait(settings: SiteSettings): string {
  return resolveMedia(settings, "about:portrait").url ?? BUILT_IN_PORTRAIT;
}

/** The portrait only when someone actually provided one (no placeholder). */
export function agentPortraitIfSet(settings: SiteSettings): string | null {
  const r = resolveMedia(settings, "about:portrait");
  return r.chosen ?? r.studio;
}
