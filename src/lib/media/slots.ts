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

/** No slot ships a built-in photograph: an empty slot renders the neutral
 * surface, so a fresh clone never shows another client's house or face. */
function builtIn(_settings: SiteSettings, _key: MediaSlotKey): string | null {
  return null;
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
export function agentPortrait(settings: SiteSettings): string | null {
  return resolveMedia(settings, "about:portrait").url;
}

/** The portrait only when someone actually provided one (no placeholder). */
export function agentPortraitIfSet(settings: SiteSettings): string | null {
  const r = resolveMedia(settings, "about:portrait");
  return r.chosen ?? r.studio;
}
