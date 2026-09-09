import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <li className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title || "—"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {row.status === "published" ? (
            <Badge variant="secondary">{t("admin.posts.published")}</Badge>
          ) : (
            <Badge variant="outline">{t("admin.posts.draft")}</Badge>
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
