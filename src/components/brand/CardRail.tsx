import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

type Props = {
  /** One entry per card. Each is placed in its own snap slot. */
  children: React.ReactNode[];
  /** Cards visible at once on a wide screen. */
  perView?: 2 | 3;
  /** Accessible name of the row. */
  label: string;
  className?: string;
  /** Keep arrow buttons visible even when the row does not overflow. */
  alwaysShowArrows?: boolean;
};

const BASIS: Record<2 | 3, string> = {
  2: "basis-[86%] sm:basis-[70%] md:basis-[calc((100%-1.25rem)/2)]",
  3: "basis-[86%] sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]",
};

/**
 * A horizontal row of cards: three at a time on a wide screen, swipeable on
 * touch, arrows on a pointer device, and it wraps around at either end so the
 * row never dead-ends. CSS scroll-snap only — no motion library, and the markup
 * renders server-side unchanged.
 *
 * Presentational: it takes cards as children and never decides what a card is
 * or how many exist. With few enough cards to fit, the arrows stay hidden and
 * the row reads as a plain grid.
 */
export function CardRail({ children, perView = 3, label, className }: Props) {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setOverflow(track.scrollWidth - track.clientWidth > 8);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [children.length]);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const slot = track.firstElementChild as HTMLElement | null;
    const width = slot ? slot.getBoundingClientRect().width + 20 : track.clientWidth;
    const max = track.scrollWidth - track.clientWidth;

    if (dir === 1) {
      // Past the last card, start over — the row behaves as a loop.
      const target = track.scrollLeft + width;
      track.scrollTo({ left: target > max - 8 ? 0 : target, behavior: "smooth" });
      return;
    }
    const target = track.scrollLeft - width;
    track.scrollTo({ left: target < 8 && track.scrollLeft < 8 ? max : Math.max(target, 0), behavior: "smooth" });
  };

  if (children.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={trackRef}
        aria-label={label}
        className={cn(
          "-mx-1 flex gap-5 overflow-x-auto overflow-y-hidden px-1 pb-2",
          // Vertical page scrolling must never be captured by the row: proximity
          // snapping instead of mandatory, no chaining sideways, and both axes
          // stay pannable so a diagonal trackpad gesture keeps scrolling the page.
          "snap-x snap-proximity overscroll-x-contain [touch-action:pan-x_pan-y]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children.map((child, i) => (
          <li key={i} className={cn("shrink-0 snap-start", BASIS[perView])}>
            {child}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-end gap-2">
        <RailButton
          onClick={() => step(-1)}
          label={t("home.rail_prev")}
          disabled={!overflow}
        >
          <ChevronLeft className="h-4 w-4" />
        </RailButton>
        <RailButton
          onClick={() => step(1)}
          label={t("home.rail_next")}
          disabled={!overflow}
        >
          <ChevronRight className="h-4 w-4" />
        </RailButton>
      </div>
    </div>
  );
}

function RailButton({
  onClick,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors duration-200",
        disabled
          ? "cursor-default opacity-30"
          : "hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}
