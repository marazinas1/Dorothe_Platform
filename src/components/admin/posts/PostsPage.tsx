import { useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Newspaper, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { adminPostsQueryOptions, deletePost, savePost } from "@/lib/posts/admin.functions";

import { PostForm, toDraft, type PostDraft } from "./PostForm";
import { PostRow } from "./PostRow";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";

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
      <AdminPageHeader icon={Newspaper} title={t("admin.posts.title")} description={t("admin.posts.hint")} actions={<Button type="button" onClick={() => setEditing(toDraft())}>
          <Plus className="h-4 w-4" />
          {t("admin.posts.add")}
        </Button>} />

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
        <AdminEmptyState icon={Newspaper} title={t("admin.posts.empty")} />
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
