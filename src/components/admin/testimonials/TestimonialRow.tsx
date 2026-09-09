import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickLocalized } from "@/lib/listings/format";
import type { TestimonialRow as Row } from "@/lib/testimonials/types";

interface Props {
  row: Row;
  locale: string;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}

export function TestimonialRow({ row, locale, onEdit, onDelete, onMove }: Props) {
  const { t } = useTranslation();
  const quote = pickLocalized(row.quote, locale, "en");

  return (
    <li className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
      <div className="min-w-0 flex-1">
        <p className="line-clamp-3 text-sm">{quote || "—"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{[row.author_name, row.author_detail].filter(Boolean).join(" · ") || "—"}</span>
          {row.published ? (
            <Badge variant="secondary">{t("admin.testimonials.published")}</Badge>
          ) : (
            <Badge variant="outline">{t("admin.testimonials.draft")}</Badge>
          )}
          {row.show_on_home ? (
            <Badge variant="secondary">{t("admin.testimonials.onHome")}</Badge>
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
          size="icon"
          variant="ghost"
          aria-label={t("admin.testimonials.edit")}
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("admin.testimonials.delete")}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
