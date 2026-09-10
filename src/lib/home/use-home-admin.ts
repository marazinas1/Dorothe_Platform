import { useEffect, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import {
  siteSettingsQueryOptions,
  updateSiteSettings,
} from "@/lib/config/site-settings.functions";
import { copyVars } from "@/lib/config/site-copy";
import { translate, translateValue, type Locale } from "@/i18n/config";

type Bag = Record<string, unknown>;

/**
 * Admin-side state for the home page: the editable copy and photograph slots,
 * plus saving. All shaping of the stored JSON happens here so the UI stays
 * presentational.
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

  function overrideFor(key: string): string {
    const entry = (content[key] ?? {}) as Record<string, unknown>;
    const raw = entry[locale];
    if (Array.isArray(raw)) return raw.join("\n");
    return typeof raw === "string" ? raw : "";
  }

  /** The line the page shows when the field has no override. */
  function defaultFor(key: string): string {
    const vars = copyVars(settings, locale);
    const list = translateValue(locale as Locale, `home.defaults.${key}`);
    if (Array.isArray(list)) return list.map(String).join("\n");
    return translate(locale as Locale, `home.defaults.${key}`, vars);
  }

  /** The override when one exists, otherwise the live default. */
  function value(key: string): string {
    const own = overrideFor(key);
    return own || defaultFor(key);
  }

  function hasOverride(key: string): boolean {
    return overrideFor(key).trim().length > 0;
  }

  /** Drop the override for this locale: the field returns to the default. */
  function resetValue(key: string) {
    setContent((prev) => {
      const entry = { ...((prev[key] ?? {}) as Record<string, unknown>) };
      delete entry[locale];
      const next = { ...prev };
      if (Object.keys(entry).length === 0) delete next[key];
      else next[key] = entry;
      return next;
    });
  }

  function setValue(key: string, next: string, kind: "line" | "paragraph" | "list") {
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

  return { settings, value, setValue, hasOverride, resetValue, mediaEntry, setMediaEntry, save };
}
