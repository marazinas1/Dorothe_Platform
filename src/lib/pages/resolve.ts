/**
 * Page copy resolution (core).
 *
 * Own value → default locale value → translated default → empty. No public page
 * changes until the owner actually types something.
 */

import { translate } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

import { pageDefinition, type PageDefinition } from "./fields";
import type { PageContentRow, ResolvedPage } from "./types";

type LocaleMap = Record<string, unknown>;

function stored(
  content: Record<string, unknown>,
  field: string,
  locale: string,
  fallbackLocale: string,
): unknown {
  const entry = content[field];
  if (!entry || typeof entry !== "object") return undefined;
  const map = entry as LocaleMap;
  return map[locale] ?? map[fallbackLocale];
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);
  }
  const text = asText(value);
  return text ? text.split("\n").map((l) => l.trim()).filter(Boolean) : [];
}

function defaultText(definition: PageDefinition, field: string, locale: Locale): string {
  const spec = definition.fields.find((f) => f.key === field);
  if (!spec) return "";
  const value = translate(locale, spec.i18n);
  return typeof value === "string" ? value : "";
}

function defaultList(definition: PageDefinition, field: string, locale: Locale): string[] {
  const spec = definition.fields.find((f) => f.key === field);
  if (!spec) return [];
  const value = translate(locale, spec.i18n, { returnObjects: true }) as unknown;
  return asList(value);
}

/**
 * Builds the accessor bundle a public page renders from. Media defaults are
 * supplied by the caller, because they live in `site_settings`.
 */
export function resolvePage(
  pageKey: string,
  row: PageContentRow | null,
  locale: Locale,
  defaultLocale: string,
  mediaDefaults: Record<string, string | null> = {},
): ResolvedPage {
  const definition = pageDefinition(pageKey);
  const content = row?.content ?? {};
  const media = row?.media ?? {};

  return {
    text(field) {
      const own = asText(stored(content, field, locale, defaultLocale));
      if (own) return own;
      return definition ? defaultText(definition, field, locale) : "";
    },
    lines(field) {
      const own = asList(stored(content, field, locale, defaultLocale));
      if (own.length > 0) return own;
      return definition ? defaultList(definition, field, locale) : [];
    },
    media(slot) {
      const entry = (media[slot] ?? {}) as { mode?: string; url?: string };
      if (entry.mode === "custom" && entry.url) return entry.url;
      return mediaDefaults[slot] ?? null;
    },
  };
}
