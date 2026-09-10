import { useEffect, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { copyVars } from "@/lib/config/site-copy";
import type { Locale } from "@/i18n/config";

import { adminPageContentQueryOptions, savePageContent, savePageDefaults } from "./admin.functions";
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
 * A field shows only what the broker typed. What the page shows when nothing is
 * typed — the locked default, otherwise the house wording — is printed greyed
 * out as a placeholder.
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

  const resolveOptions = {
    mediaDefaults: { portrait: settings.primary_agent_photo_url ?? null },
    vars: copyVars(settings, locale),
  };

  /** What the page shows with the current edits applied. */
  const resolved = resolvePage(
    page,
    { page, content, defaults: row?.defaults ?? {}, media },
    locale as Locale,
    settings.default_locale,
    resolveOptions,
  );

  /** What the page shows for a field with no override at all. */
  const fallback = resolvePage(
    page,
    { page, content: {}, defaults: row?.defaults ?? {}, media },
    locale as Locale,
    settings.default_locale,
    resolveOptions,
  );

  function value(key: string): string {
    const raw = (content[key] ?? {})[locale];
    if (Array.isArray(raw)) return raw.join("\n");
    return typeof raw === "string" ? raw : "";
  }

  function placeholder(key: string): string {
    const line = fallback.text(key);
    if (line) return line;
    return fallback.lines(key).join("\n");
  }

  function hasOverride(key: string): boolean {
    return value(key).trim().length > 0;
  }

  function setValue(key: string, next: string, kind: PageFieldKind) {
    setContent((prev) => {
      const entry = { ...(prev[key] ?? {}) };
      entry[locale] =
        kind === "list" ? next.split("\n").map((l) => l.trim()).filter(Boolean) : next;
      return { ...prev, [key]: entry };
    });
  }

  function withoutOverride(prev: Bag, key: string): Bag {
    const entry = { ...(prev[key] ?? {}) };
    delete entry[locale];
    const next = { ...prev };
    if (Object.keys(entry).length === 0) delete next[key];
    else next[key] = entry;
    return next;
  }

  /** Drop the override for this locale: the field returns to the default. */
  function resetValue(key: string) {
    setContent((prev) => withoutOverride(prev, key));
  }

  function mediaEntry(slot: string) {
    const entry = media[slot];
    return {
      mode: entry?.mode === "custom" ? ("custom" as const) : ("default" as const),
      url: entry?.url ?? "",
    };
  }

  function setMediaEntry(slot: string, next: { mode: "default" | "custom"; url: string }) {
    setMedia((prev) => ({ ...prev, [slot]: next }));
  }

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: adminPageContentQueryOptions(page).queryKey });
    await qc.invalidateQueries({ queryKey: pageContentQueryOptions(page).queryKey });
  }

  async function save() {
    await savePageContent({ data: { page, content: content as never, media } });
    await invalidate();
  }

  /** Developer-only: lock this field's current wording in as the default. */
  async function setAsDefault(key: string, kind: PageFieldKind) {
    const current = value(key) || placeholder(key);
    if (!current.trim()) return;
    const stored =
      kind === "list" ? current.split("\n").map((l) => l.trim()).filter(Boolean) : current;
    const defaults = { ...((row?.defaults ?? {}) as Bag) };
    const entry = { ...(defaults[key] ?? {}) };
    entry[locale] = stored;
    defaults[key] = entry;

    const nextContent = withoutOverride(content, key);
    setContent(nextContent);
    await savePageDefaults({
      data: { page, defaults: defaults as never, content: nextContent as never },
    });
    await invalidate();
  }

  return {
    settings,
    value,
    placeholder,
    setValue,
    hasOverride,
    resetValue,
    setAsDefault,
    mediaEntry,
    setMediaEntry,
    resolved,
    save,
  };
}

