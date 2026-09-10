import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/admin/ui/StatusChip";
import { pickLocalized } from "@/lib/listings/format";
import { formatPostDate } from "@/lib/posts/date";
import type { PostRow as Row } from "@/lib/posts/types";

interface Props {
  row: Row;
  locale: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostRow({ row, locale, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const title = pickLocalized(row.title, locale, "de");
  const date = formatPostDate(row.published_at, locale);

  return (
    <li className="flex items-start gap-4 rounded-[var(--radius)] border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title || "—"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {row.status === "published" ? (
            <StatusChip icon="published" tone="active">
              {t("admin.posts.published")}
            </StatusChip>
          ) : (
            <StatusChip icon="draft" tone="muted">
              {t("admin.posts.draft")}
            </StatusChip>
          )}
          {date ? <span>{date}</span> : null}
          <span className="truncate">/{row.slug}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("admin.posts.edit")}
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("admin.posts.delete")}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
