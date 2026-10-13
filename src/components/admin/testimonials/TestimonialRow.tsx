import { useTranslation } from "react-i18next";
import { ChevronDown, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { pickLocalized } from "@/lib/listings/format";
import type { TestimonialRow as Row } from "@/lib/testimonials/types";

const PILL =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold";

interface Props {
  row: Row;
  locale: string;
  expanded: boolean;
  canReorder: boolean;
  onToggle: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onMoveStep: (direction: -1 | 1) => void;
}

/** Collapsed testimonial line: grip, name, quote, status pills, chevron. */
export function TestimonialRow(p: Props) {
  const { t } = useTranslation();
  const { row } = p;
  const quote = pickLocalized(row.quote, p.locale, "en");
  const name = [row.author_name, row.author_detail].filter(Boolean).join(", ") || "—";

  return (
    <div
      className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted"
      onDragOver={(e) => p.canReorder && e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        p.onDrop();
      }}
    >
      <button
        type="button"
        draggable={p.canReorder}
        disabled={!p.canReorder}
        aria-label={t("admin.testimonials.dragHandle", { name })}
        title={t("admin.testimonials.dragHandle", { name })}
        className="grid h-8 w-6 shrink-0 cursor-grab place-items-center rounded-[var(--radius)] text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", row.id);
          p.onDragStart();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            p.onMoveStep(e.key === "ArrowUp" ? -1 : 1);
          }
        }}
      >
        <GripVertical className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <button
        type="button"
        onClick={p.onToggle}
        aria-expanded={p.expanded}
        className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-foreground">{name}</span>
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {quote ? `"${quote}"` : "—"}
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-2 sm:flex">
          {row.published ? (
            <span className={cn(PILL, "bg-success/10 text-success")}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
              {t("admin.testimonials.shownOnSite")}
            </span>
          ) : (
            <span className={cn(PILL, "bg-secondary text-muted-foreground")}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
              {t("admin.testimonials.hidden")}
            </span>
          )}
          {row.show_on_home ? (
            <span className={cn(PILL, "bg-secondary text-foreground")}>
              {t("admin.testimonials.homePage")}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", p.expanded && "rotate-180")}
          aria-hidden
        />
      </button>
    </div>
  );
}
