import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type NavSection = { key: string; label: string };

/** Anchor id of a whole editor section wrapper. */
export const sectionAnchorId = (key: string) => `listing-section-${key}`;

/**
 * Sticky horizontal section index above the full-width form: one click jumps
 * to a section and the current section stays underlined while scrolling.
 */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(sections[0]?.key ?? "");
  const keys = sections.map((s) => s.key).join("|");

  useEffect(() => {
    const els = keys
      .split("|")
      .map((k) => document.getElementById(sectionAnchorId(k)))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id.replace("listing-section-", ""));
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [keys]);

  return (
    <nav
      aria-label={t("admin.listings.sectionNav")}
      className="sticky top-14 z-20 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur md:-mx-6 md:px-6"
    >
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {sections.map((s) => {
          const isActive = s.key === active;
          return (
            <li key={s.key} className="shrink-0">
              <a
                href={`#${sectionAnchorId(s.key)}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(s.key)}
                className={`-mb-px inline-flex min-h-11 items-center border-b-2 px-3 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                  isActive
                    ? "border-foreground font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
