import { useTranslation } from "react-i18next";

export type NavSection = { key: string; label: string };

/** Anchor id of a whole editor section wrapper. */
export const sectionAnchorId = (key: string) => `listing-section-${key}`;

/**
 * Sticky left-hand section index (broker-admin.html "anchors"): one click jumps
 * to a section, so the broker never scrolls through the whole form to reach
 * the photos or the energy certificate.
 */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t("admin.listings.sectionNav")}
      className="rounded-[var(--radius)] border border-border bg-card p-4"
    >
      <p className="mb-2 text-sm font-bold">{t("admin.listings.sectionNav")}</p>
      <ul className="grid gap-0.5 border-l border-border">
        {sections.map((s) => (
          <li key={s.key}>
            <a
              href={`#${sectionAnchorId(s.key)}`}
              className="-ml-px block border-l-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
