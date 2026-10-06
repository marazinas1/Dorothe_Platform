import { Fragment, useMemo, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Newspaper, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pickLocalized } from "@/lib/listings/format";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { adminPostsQueryOptions, savePost } from "@/lib/posts/admin.functions";

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
  const [search, setSearch] = useState("");

  const enabled = (settings.enabled_locales ?? []).filter(Boolean);
  const locales = enabled.length > 0 ? enabled : [settings.default_locale];
  const primaryLocale = locales[0];
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const title = pickLocalized(row.title, primaryLocale, "de").toLowerCase();
      const excerpt = pickLocalized(row.excerpt, primaryLocale, "de").toLowerCase();
      return title.includes(q) || excerpt.includes(q) || row.slug.toLowerCase().includes(q);
    });
  }, [rows, search, primaryLocale]);

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
      <AdminPageHeader title={t("admin.posts.title")} description={t("admin.posts.hint")} actions={<Button type="button" onClick={() => setEditing(toDraft())}>
          <Plus className="h-4 w-4" />
          {t("admin.posts.add")}
        </Button>} />

      {editing && !editing.id ? (
        <PostForm
          initial={editing}
          locales={locales}
          onSave={save}
          onCancel={() => setEditing(null)}
          ensurePostId={ensurePostId}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-h-10 min-w-[220px] max-w-[420px] flex-1 items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("admin.posts.search")}
            aria-label={t("admin.posts.search")}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
        <span className="ml-auto text-[13px] text-muted-foreground" aria-live="polite">
          {t("admin.posts.count", { count: filteredRows.length })}
        </span>
      </div>

      {rows.length === 0 ? (
        <AdminEmptyState icon={Newspaper} title={t("admin.posts.empty")} />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-card">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap border-b border-border px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("admin.posts.table.article")}</th>
                <th className="whitespace-nowrap border-b border-border px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("admin.posts.table.status")}</th>
                <th className="whitespace-nowrap border-b border-border px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("admin.posts.table.published")}</th>
                <th className="whitespace-nowrap border-b border-border px-3.5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("admin.posts.table.views30")}</th>
                <th className="whitespace-nowrap border-b border-border px-3.5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("admin.posts.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
          {filteredRows.map((row) => {
            const expanded = editing?.id === row.id;
            return (
              <Fragment key={row.id}>
                <PostRow
                  row={row}
                  locale={primaryLocale}
                  expanded={expanded}
                  onEdit={() => setEditing(expanded ? null : toDraft(row))}
                />
                {expanded ? (
                  <tr>
                    <td colSpan={5} className="border-b border-border p-4">
                      <PostForm
                        initial={editing ?? toDraft(row)}
                        locales={locales}
                        onSave={save}
                        onCancel={() => setEditing(null)}
                        ensurePostId={ensurePostId}
                      />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
            </tbody>
          </table>
          {filteredRows.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">{t("admin.posts.noMatches")}</p>
          ) : null}
        </div>
      )}

    </div>
  );
}
