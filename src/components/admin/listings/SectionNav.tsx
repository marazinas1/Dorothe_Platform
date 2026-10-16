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

  // Active = the last section whose top has passed the sticky bars. Deterministic,
  // unlike an IntersectionObserver that only reports sections that changed.
  useEffect(() => {
    const list = keys.split("|");
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 160;
      let current = list[0] ?? "";
      for (const k of list) {
        const el = document.getElementById(sectionAnchorId(k));
        if (el && el.getBoundingClientRect().top <= line) current = k;
      }
      // At the page end the last short sections can never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = list[list.length - 1] ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [keys]);

  // Keep the active tab visible inside the horizontally scrolling row.
  useEffect(() => {
    document
      .querySelector(`[data-section-tab="${active}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <nav
      aria-label={t("admin.listings.sectionNav")}
      className="sticky top-14 z-20 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur md:-mx-6 md:px-6"
    >
      <ul className="flex gap-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none]">
        {sections.map((s) => {
          const isActive = s.key === active;
          return (
            <li key={s.key} className="shrink-0">
              <a
                href={`#${sectionAnchorId(s.key)}`}
                data-section-tab={s.key}
                aria-current={isActive ? "location" : undefined}
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
