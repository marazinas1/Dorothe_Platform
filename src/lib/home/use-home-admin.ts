import { useEffect, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import {
  siteSettingsQueryOptions,
  updateSiteSettings,
} from "@/lib/config/site-settings.functions";

import { activateHomeTemplate, createHomePreviewLink } from "./admin.functions";
import { homeTemplateKey, type HomeTemplateKey } from "./templates";

type Bag = Record<string, unknown>;

/**
 * Admin-side state for home page management: which design is live, the editable
 * copy and photograph slots, and the three actions (preview, activate, save).
 * All shaping of the stored JSON happens here so the UI stays presentational.
 */
export function useHomeAdmin(locale: string) {
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const active = homeTemplateKey(settings.active_home_template);

  const [content, setContent] = useState<Bag>(() => ({ ...(settings.home_content ?? {}) }));
  const [media, setMedia] = useState<Bag>(() => ({ ...(settings.home_media ?? {}) }));

  useEffect(() => {
    setContent({ ...(settings.home_content ?? {}) });
    setMedia({ ...(settings.home_media ?? {}) });
  }, [settings]);

  /** Stored per locale, so switching admin language never overwrites the other. */
  function value(key: string): string {
    const entry = (content[key] ?? {}) as Record<string, unknown>;
    const raw = entry[locale];
    if (Array.isArray(raw)) return raw.join("\n");
    return typeof raw === "string" ? raw : "";
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
      data: {
        tab: "home",
        values: {
          home_content: content,
          home_media: media,
          home_template_extras: settings.home_template_extras ?? {},
        },
      },
    });
    await qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
  }

  async function activate(template: HomeTemplateKey) {
    await activateHomeTemplate({ data: { template } });
    await qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
  }

  /** Opens the signed preview in a new tab; nothing is activated. */
  async function preview(template: HomeTemplateKey) {
    const link = await createHomePreviewLink({ data: { template } });
    const url = `/${locale}?home=${link.template}&t=${encodeURIComponent(link.token)}`;
    window.open(url, "_blank", "noopener");
  }

  return { settings, active, value, setValue, mediaEntry, setMediaEntry, save, activate, preview };
}
