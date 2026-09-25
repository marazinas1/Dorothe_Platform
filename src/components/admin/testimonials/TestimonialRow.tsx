import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ChevronDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/admin/ui/StatusChip";
import { pickLocalized } from "@/lib/listings/format";
import type { TestimonialRow as Row } from "@/lib/testimonials/types";

interface Props {
  row: Row;
  locale: string;
  onEdit: () => void;
  /** Omitted when the signed-in role may not delete. */
  onDelete?: () => void;
  onMove: (direction: "up" | "down") => void;
  expanded: boolean;
}

export function TestimonialRow({ row, locale, onEdit, onDelete, onMove, expanded }: Props) {
  const { t } = useTranslation();
  const quote = pickLocalized(row.quote, locale, "en");

  return (
    <div className="flex items-start gap-4 rounded-[var(--radius)] border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="min-w-0 flex-1">
        <p className="line-clamp-3 text-sm">{quote || "—"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{[row.author_name, row.author_detail].filter(Boolean).join(" · ") || "—"}</span>
          {row.published ? (
            <StatusChip icon="published" tone="active">
              {t("admin.testimonials.published")}
            </StatusChip>
          ) : (
            <StatusChip icon="draft" tone="muted">
              {t("admin.testimonials.draft")}
            </StatusChip>
          )}
          {row.show_on_home ? (
            <StatusChip icon="home" tone="active">
              {t("admin.testimonials.onHome")}
            </StatusChip>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("admin.testimonials.moveUp")}
          onClick={() => onMove("up")}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("admin.testimonials.moveDown")}
          onClick={() => onMove("down")}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label={t("admin.testimonials.edit")}
          aria-expanded={expanded}
          onClick={onEdit}
        >
          {expanded ? t("admin.common.close") : t("admin.testimonials.edit")}
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </Button>
        {onDelete ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("admin.testimonials.delete")}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        ) : null}
      </div>
    </div>
  );
}
