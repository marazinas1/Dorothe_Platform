import { useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { adminPostsQueryOptions, deletePost, savePost } from "@/lib/posts/admin.functions";

import { PostForm, toDraft, type PostDraft } from "./PostForm";
import { PostRow } from "./PostRow";

/** Articles: write, publish, and keep older links working. */
export function PostsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: rows } = useSuspenseQuery(adminPostsQueryOptions);
  const [editing, setEditing] = useState<PostDraft | null>(null);

  const enabled = (settings.enabled_locales ?? []).filter(Boolean);
  const locales = enabled.length > 0 ? enabled : [settings.default_locale];

  async function refresh() {
    await qc.invalidateQueries({ queryKey: adminPostsQueryOptions.queryKey });
  }

  async function save(draft: PostDraft) {
    await savePost({ data: draft });
    await refresh();
    setEditing(null);
  }

  /** Uploading a cover needs an article row; create it quietly and keep editing. */
  async function ensurePostId(draft: PostDraft) {
    const result = await savePost({ data: draft });
    setEditing((prev) => (prev ? { ...prev, id: result.id } : prev));
    await refresh();
    return result.id;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("admin.posts.title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("admin.posts.hint")}</p>
        </div>
        <Button type="button" onClick={() => setEditing(toDraft())}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.posts.add")}
        </Button>
      </header>

      {editing ? (
        <PostForm
          initial={editing}
          locales={locales}
          onSave={save}
          onCancel={() => setEditing(null)}
          ensurePostId={ensurePostId}
        />
      ) : null}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("admin.posts.empty")}</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <PostRow
              key={row.id}
              row={row}
              locale={locales[0]}
              onEdit={() => setEditing(toDraft(row))}
              onDelete={async () => {
                if (!window.confirm(t("admin.posts.confirmDelete"))) return;
                await deletePost({ data: { id: row.id } });
                await refresh();
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
