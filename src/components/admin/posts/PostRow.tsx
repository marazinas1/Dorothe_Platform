import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ImageOff, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pickLocalized } from "@/lib/listings/format";
import { cn } from "@/lib/utils";
import type { PostRow as Row } from "@/lib/posts/types";

interface Props {
  row: Row;
  locale: string;
  onEdit: () => void;
  expanded: boolean;
}

export function PostRow({ row, locale, onEdit, expanded }: Props) {
  const { t } = useTranslation();
  const title = pickLocalized(row.title, locale, "de");
  const date = row.published_at
    ? new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(row.published_at))
    : null;

  return (
    <tr className="group hover:bg-muted">
      <td className="border-b border-border px-3.5 py-3 align-middle group-last:border-b-0">
        <div className="flex items-center gap-3">
          <span className="block h-12 w-16 shrink-0 overflow-hidden rounded-[var(--radius)] bg-secondary">
            {row.cover_path ? (
              <img src={row.cover_path} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <ImageOff className="h-4 w-4 text-muted-foreground" />
              </span>
            )}
          </span>
          <span className="min-w-0">
            <b className="block truncate font-semibold">{title || "—"}</b>
            <span className="block truncate text-[12.5px] text-muted-foreground">/guides/{row.slug}</span>
          </span>
        </div>
      </td>
      <td className="border-b border-border px-3.5 py-3 align-middle group-last:border-b-0">
        {row.status === "published" ? (
          <PostStatus tone="published">{t("admin.posts.published")}</PostStatus>
        ) : (
          <PostStatus tone="draft">{t("admin.posts.draft")}</PostStatus>
        )}
      </td>
      <td className="whitespace-nowrap border-b border-border px-3.5 py-3 align-middle text-muted-foreground group-last:border-b-0">
        {date ?? t("admin.posts.notYet")}
      </td>
      <td className="border-b border-border px-3.5 py-3 text-right align-middle text-muted-foreground group-last:border-b-0">
        {t("admin.posts.viewsUnavailable")}
      </td>
      <td className="border-b border-border px-3.5 py-3 text-right align-middle group-last:border-b-0">
        <div className="flex justify-end gap-1">
          <Button type="button" size="sm" variant="outline" aria-expanded={expanded} onClick={onEdit}>
            <Pencil className="h-4 w-4" strokeWidth={1.75} />
            {expanded ? t("admin.common.close") : t("admin.posts.edit")}
          </Button>
        </div>
      </td>
    </tr>
  );
}

function PostStatus({ tone, children }: { tone: "published" | "draft"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-[9px] py-0.5 text-xs font-semibold",
        tone === "published" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground",
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
