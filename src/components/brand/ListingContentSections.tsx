import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";

type Section = {
  key: string;
  items?: Record<string, unknown> | null;
};

type Props = {
  sections: unknown;
  locale: Locale;
};

// Only the sections that are still written by hand. Property and building info
// were retired in favour of the generated specification table, so legacy rows
// keep their data in the database but stop being rendered twice.
// Surroundings moved into the location block, where a reader is already
// thinking about where the property is.
const KNOWN_KEYS = ["highlights"] as const;

function pickItems(items: unknown, locale: string): string[] {
  if (!items || typeof items !== "object") return [];
  const obj = items as Record<string, unknown>;
  const primary = obj[locale];
  const fb = obj.de ?? obj.en ?? Object.values(obj)[0];
  const chosen = Array.isArray(primary) ? primary : Array.isArray(fb) ? fb : [];
  return chosen.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

/**
 * Hand-written content blocks (highlights, surroundings).
 * Sections without items are skipped. The order is fixed by KNOWN_KEYS, not by
 * the stored array, so the admin form can promise where each text appears.
 */
export function ListingContentSections({ sections, locale }: Props) {
  const { t } = useTranslation();
  if (!Array.isArray(sections)) return null;

  const rendered = (sections as Section[])
    .map((s) => ({ key: s.key, items: pickItems(s?.items, locale) }))
    .filter((s) => KNOWN_KEYS.includes(s.key as (typeof KNOWN_KEYS)[number]) && s.items.length > 0)
    .sort(
      (a, b) =>
        KNOWN_KEYS.indexOf(a.key as (typeof KNOWN_KEYS)[number]) -
        KNOWN_KEYS.indexOf(b.key as (typeof KNOWN_KEYS)[number]),
    );

  if (rendered.length === 0) return null;

  return (
    <div className="space-y-12">
      {rendered.map((s) => (
        <section key={s.key}>
          <ul className="grid max-w-3xl gap-x-8 gap-y-3 sm:grid-cols-2">
            {s.items.map((item, i) => (
              <li key={`${s.key}-${i}`} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <span aria-hidden>✓</span>{item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
