import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import type { PostRow } from "@/lib/posts/types";

export interface PostDraft {
  id?: string;
  slug: string;
  status: "draft" | "published";
  published_at: string | null;
  cover_path: string | null;
  cover_alt: Record<string, string>;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  body: Record<string, string>;
  meta_title: Record<string, string>;
  meta_description: Record<string, string>;
}

export function toDraft(row?: PostRow): PostDraft {
  return {
    id: row?.id,
    slug: row?.slug ?? "",
    status: row?.status ?? "draft",
    published_at: row?.published_at ?? null,
    cover_path: row?.cover_path ?? "",
    cover_alt: { ...(row?.cover_alt ?? {}) },
    title: { ...(row?.title ?? {}) },
    excerpt: { ...(row?.excerpt ?? {}) },
    body: { ...(row?.body ?? {}) },
    meta_title: { ...(row?.meta_title ?? {}) },
    meta_description: { ...(row?.meta_description ?? {}) },
  };
}

type Field = "title" | "excerpt" | "body" | "meta_title" | "meta_description" | "cover_alt";

interface Props {
  initial: PostDraft;
  locales: string[];
  onSave: (draft: PostDraft) => Promise<void>;
  onCancel: () => void;
}

/** One article, one card: the words per language, the picture, the date. */
export function PostForm({ initial, locales, onSave, onCancel }: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<PostDraft>(initial);

  const set = (field: Field, loc: string, value: string) =>
    setDraft((p) => ({ ...p, [field]: { ...p[field], [loc]: value } }));

  const dateValue = draft.published_at ? draft.published_at.slice(0, 10) : "";

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-5">
      {locales.map((loc) => (
        <div key={loc} className="space-y-4 border-b border-border/60 pb-5 last:border-0 last:pb-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {loc.toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`post-title-${loc}`}>{t("admin.posts.titleField")}</Label>
            <Input
              id={`post-title-${loc}`}
              value={draft.title[loc] ?? ""}
              onChange={(e) => set("title", loc, e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`post-excerpt-${loc}`}>{t("admin.posts.excerpt")}</Label>
            <Textarea
              id={`post-excerpt-${loc}`}
              rows={2}
              value={draft.excerpt[loc] ?? ""}
              onChange={(e) => set("excerpt", loc, e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`post-body-${loc}`}>{t("admin.posts.body")}</Label>
            <Textarea
              id={`post-body-${loc}`}
              rows={10}
              value={draft.body[loc] ?? ""}
              onChange={(e) => set("body", loc, e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("admin.posts.bodyHint")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`post-metatitle-${loc}`}>{t("admin.posts.metaTitle")}</Label>
              <Input
                id={`post-metatitle-${loc}`}
                value={draft.meta_title[loc] ?? ""}
                onChange={(e) => set("meta_title", loc, e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`post-metadesc-${loc}`}>{t("admin.posts.metaDescription")}</Label>
              <Input
                id={`post-metadesc-${loc}`}
                value={draft.meta_description[loc] ?? ""}
                onChange={(e) => set("meta_description", loc, e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`post-coveralt-${loc}`}>{t("admin.posts.coverAlt")}</Label>
              <Input
                id={`post-coveralt-${loc}`}
                value={draft.cover_alt[loc] ?? ""}
                onChange={(e) => set("cover_alt", loc, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="post-cover">{t("admin.posts.cover")}</Label>
          <Input
            id="post-cover"
            value={draft.cover_path ?? ""}
            onChange={(e) => setDraft((p) => ({ ...p, cover_path: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="post-date">{t("admin.posts.date")}</Label>
          <Input
            id="post-date"
            type="date"
            value={dateValue}
            onChange={(e) =>
              setDraft((p) => ({
                ...p,
                published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
              }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="post-slug">{t("admin.posts.slug")}</Label>
          <Input
            id="post-slug"
            value={draft.slug}
            placeholder={t("admin.posts.slugAuto")}
            onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={draft.status === "published"}
          onCheckedChange={(v) => setDraft((p) => ({ ...p, status: v ? "published" : "draft" }))}
        />
        {t("admin.posts.published")}
      </label>

      <div className="flex items-center gap-3">
        <SaveButton onSubmit={() => onSave(draft)} />
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("admin.posts.cancel")}
        </Button>
      </div>
    </div>
  );
}
