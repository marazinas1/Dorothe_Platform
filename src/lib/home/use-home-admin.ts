import { useEffect, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import {
  saveHomeDefaults,
  siteSettingsQueryOptions,
  updateSiteSettings,
} from "@/lib/config/site-settings.functions";
import { homeDefaultList, homeDefaultText } from "./content";

type Bag = Record<string, unknown>;
type Kind = "line" | "paragraph" | "list";

/**
 * Admin-side state for the home page: the editable copy and photograph slots,
 * plus saving. All shaping of the stored JSON happens here so the UI stays
 * presentational.
 *
 * An empty field is not empty on the page: it shows the default, which the
 * editor prints greyed out as a placeholder. Typing overrides it, clearing it
 * brings the default back, and a developer can freeze the current wording as
 * the new default.
 */
export function useHomeAdmin(locale: string) {
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);

  const [content, setContent] = useState<Bag>(() => ({ ...(settings.home_content ?? {}) }));
  const [media, setMedia] = useState<Bag>(() => ({ ...(settings.home_media ?? {}) }));

  useEffect(() => {
    setContent({ ...(settings.home_content ?? {}) });
    setMedia({ ...(settings.home_media ?? {}) });
  }, [settings]);

  /** What the broker typed, nothing else. */
  function value(key: string): string {
    const entry = (content[key] ?? {}) as Record<string, unknown>;
    const raw = entry[locale];
    if (Array.isArray(raw)) return raw.join("\n");
    return typeof raw === "string" ? raw : "";
  }

  /** The line the page shows when the field has no override. */
  function placeholder(key: string): string {
    const line = homeDefaultText(settings, key, locale);
    if (line) return line;
    return homeDefaultList(settings, key, locale).join("\n");
  }


  function hasOverride(key: string): boolean {
    return value(key).trim().length > 0;
  }

  function withoutOverride(prev: Bag, key: string): Bag {
    const entry = { ...((prev[key] ?? {}) as Record<string, unknown>) };
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

  function setValue(key: string, next: string, kind: Kind) {
    setContent((prev) => {
      const entry = { ...((prev[key] ?? {}) as Record<string, unknown>) };
      entry[locale] =
        kind === "list" ? next.split("\n").map((l) => l.trim()).filter(Boolean) : next;
      return { ...prev, [key]: entry };
    });
  }

  function mediaEntry(slot: string): { mode: "default" | "custom"; url: string } {
    const entry = (media[slot] ?? {}) as { mode?: string; url?: string };
    return { mode: entry.mode === "custom" ? "custom" : "default", url: entry.url ?? "" };
  }

  function setMediaEntry(slot: string, next: { mode: "default" | "custom"; url: string }) {
    setMedia((prev) => ({ ...prev, [slot]: next }));
  }

  async function save() {
    await updateSiteSettings({
      data: { tab: "home", values: { home_content: content, home_media: media } },
    });
    await qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
  }

  /** Developer-only: lock this field's current wording in as the default. */
  async function setAsDefault(key: string, kind: Kind) {
    const current = value(key) || placeholder(key);
    if (!current.trim()) return;
    const stored =
      kind === "list" ? current.split("\n").map((l) => l.trim()).filter(Boolean) : current;
    const defaults = { ...((settings.home_defaults ?? {}) as Bag) };
    const entry = { ...((defaults[key] ?? {}) as Record<string, unknown>) };
    entry[locale] = stored;
    defaults[key] = entry;

    const nextContent = withoutOverride(content, key);
    setContent(nextContent);
    await saveHomeDefaults({ data: { home_defaults: defaults, home_content: nextContent } });
    await qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
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
    save,
  };
}

