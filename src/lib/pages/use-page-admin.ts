import { useEffect, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { copyVars } from "@/lib/config/site-copy";
import type { Locale } from "@/i18n/config";

import { adminPageContentQueryOptions, savePageContent } from "./admin.functions";
import { pageContentQueryOptions } from "./queries.functions";
import { resolvePage } from "./resolve";
import type { PageFieldKind } from "./fields";

import type { PageContentRow } from "./types";

type Bag = PageContentRow["content"];
type MediaBag = PageContentRow["media"];

/**
 * Admin state for one static page: its stored copy, its photograph slots and
 * saving. Shaping of the stored JSON lives here so the UI stays presentational.
 *
 * A field with no stored override shows the page's current default text as a
 * real value, so the editor always shows exactly what the website shows.
 */
export function usePageAdmin(page: string, locale: string) {
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: row } = useSuspenseQuery(adminPageContentQueryOptions(page));

  const [content, setContent] = useState<Bag>(() => ({ ...((row?.content ?? {}) as Bag) }));
  const [media, setMedia] = useState<MediaBag>(() => ({ ...((row?.media ?? {}) as MediaBag) }));

  useEffect(() => {
    setContent({ ...((row?.content ?? {}) as Bag) });
    setMedia({ ...((row?.media ?? {}) as MediaBag) });
  }, [row]);

  /** What the page shows today for a field without an override. */
  const resolved = resolvePage(page, { page, content, media }, locale as Locale, settings.default_locale, {
    mediaDefaults: { portrait: settings.primary_agent_photo_url ?? null },
    vars: copyVars(settings, locale),
  });

  function overrideFor(key: string): string {
    const raw = (content[key] ?? {})[locale];
    if (Array.isArray(raw)) return raw.join("\n");
    return typeof raw === "string" ? raw : "";
  }

  function defaultFor(key: string): string {
    const line = resolved.text(key);
    if (line) return line;
    return resolved.lines(key).join("\n");
  }

  /** The override when one exists, otherwise the live default. */
  function value(key: string): string {
    const own = overrideFor(key);
    return own || defaultFor(key);
  }

  function hasOverride(key: string): boolean {
    return overrideFor(key).trim().length > 0;
  }

  function setValue(key: string, next: string, kind: PageFieldKind) {
    setContent((prev) => {
      const entry = { ...(prev[key] ?? {}) };
      entry[locale] =
        kind === "list" ? next.split("\n").map((l) => l.trim()).filter(Boolean) : next;
      return { ...prev, [key]: entry };
    });
  }

  /** Drop the override for this locale: the field returns to the default. */
  function resetValue(key: string) {
    setContent((prev) => {
      const entry = { ...(prev[key] ?? {}) };
      delete entry[locale];
      const next = { ...prev };
      if (Object.keys(entry).length === 0) delete next[key];
      else next[key] = entry;
      return next;
    });
  }

  function mediaEntry(slot: string) {
    const entry = media[slot];
    return { mode: entry?.mode === "custom" ? ("custom" as const) : ("default" as const), url: entry?.url ?? "" };
  }

  function setMediaEntry(slot: string, next: { mode: "default" | "custom"; url: string }) {
    setMedia((prev) => ({ ...prev, [slot]: next }));
  }

  async function save() {
    await savePageContent({ data: { page, content: content as never, media } });
    await qc.invalidateQueries({ queryKey: adminPageContentQueryOptions(page).queryKey });
    await qc.invalidateQueries({ queryKey: pageContentQueryOptions(page).queryKey });
  }

  return { settings, value, setValue, hasOverride, resetValue, mediaEntry, setMediaEntry, resolved, save };
}
