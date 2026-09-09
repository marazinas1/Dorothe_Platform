/**
 * Page copy resolution (core).
 *
 * Own value → default locale value → translated default → empty. No public page
 * changes until the owner actually types something.
 */

import { translate, translateValue } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

import { pageDefinition, type PageDefinition } from "./fields";
import type { PageContentRow, ResolvedPage } from "./types";

type LocaleMap = Record<string, unknown>;
type Vars = Record<string, string | number | null | undefined>;

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

function specFor(definition: PageDefinition | undefined, field: string) {
  return definition?.fields.find((f) => f.key === field);
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
  options: { mediaDefaults?: Record<string, string | null>; vars?: Vars } = {},
): ResolvedPage {
  const definition = pageDefinition(pageKey);
  const content = row?.content ?? {};
  const media = row?.media ?? {};
  const mediaDefaults = options.mediaDefaults ?? {};

  return {
    text(field) {
      const own = asText(stored(content, field, locale, defaultLocale));
      if (own) return own;
      const spec = specFor(definition, field);
      if (!spec) return "";
      const translated = translate(locale, spec.i18n, options.vars);
      return translated === spec.i18n ? "" : translated;
    },
    lines(field) {
      const own = asList(stored(content, field, locale, defaultLocale));
      if (own.length > 0) return own;
      const spec = specFor(definition, field);
      if (!spec) return [];
      const raw = translateValue(locale, spec.i18n);
      if (Array.isArray(raw)) {
        return raw
          .map((v) =>
            typeof v === "string"
              ? (options.vars ? interpolate(v, options.vars) : v).trim()
              : "",
          )
          .filter(Boolean);
      }
      return asList(typeof raw === "string" ? raw : undefined);
    },
    media(slot) {
      const entry = (media[slot] ?? {}) as { mode?: string; url?: string };
      if (entry.mode === "custom" && entry.url?.trim()) return entry.url.trim();
      return mediaDefaults[slot] ?? null;
    },
  };
}

function interpolate(value: string, vars: Vars): string {
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => {
    const v = vars[name];
    return v == null ? match : String(v);
  });
}
