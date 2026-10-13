import { useMemo, useRef, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, Plus, Quote, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePermission } from "@/lib/auth/use-permission";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import {
  adminTestimonialsQueryOptions,
  deleteTestimonial,
  reorderTestimonials,
  saveTestimonial,
} from "@/lib/testimonials/admin.functions";
import { HOME_TESTIMONIAL_LIMIT, type TestimonialRow as Row } from "@/lib/testimonials/types";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";

import { TestimonialForm, toDraft, type TestimonialDraft } from "./TestimonialForm";
import { TestimonialRow } from "./TestimonialRow";

/** Client voices: search, drag to order, expand to edit inline. */
export function TestimonialsPage() {
  const { t } = useTranslation();
  const canDelete = usePermission("settings.edit");
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: rows } = useSuspenseQuery(adminTestimonialsQueryOptions);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const dragged = useRef<string | null>(null);

  const enabled = (settings.enabled_locales ?? []).filter(Boolean);
  const locales = enabled.length > 0 ? enabled : [settings.default_locale];
  const onHome = rows.filter((r) => r.show_on_home);
  const homeFullFor = (id?: string) =>
    onHome.filter((r) => r.id !== id).length >= HOME_TESTIMONIAL_LIMIT;

  const q = search.trim().toLowerCase();
  const visible = useMemo(
    () =>
      q
        ? rows.filter((r) =>
            [r.author_name, r.author_detail, ...Object.values(r.quote ?? {})]
              .join(" ")
              .toLowerCase()
              .includes(q),
          )
        : rows,
    [rows, q],
  );
  const canReorder = !q;
  const allOpen = visible.length > 0 && visible.every((r) => open.has(r.id));

  const refresh = () => qc.invalidateQueries({ queryKey: adminTestimonialsQueryOptions.queryKey });
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  async function persist(next: Row[]) {
    qc.setQueryData(adminTestimonialsQueryOptions.queryKey, next);
    try {
      await reorderTestimonials({ data: { order: next.map((r) => r.id) } });
    } catch {
      toast.error(t("admin.common.saveFailed", { defaultValue: "Could not save." }));
    }
    await refresh();
  }
  function moveTo(source: string, target: string) {
    const from = rows.findIndex((r) => r.id === source);
    const to = rows.findIndex((r) => r.id === target);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...rows];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    void persist(next);
  }
  function step(id: string, dir: -1 | 1) {
    const i = rows.findIndex((r) => r.id === id);
    const target = rows[i + dir];
    if (target) moveTo(id, target.id);
  }

  async function save(draft: TestimonialDraft) {
    await saveTestimonial({ data: draft });
    await refresh();
    if (draft.id) toggle(draft.id);
    else setCreating(false);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Quote}
        title={t("admin.testimonials.title")}
        description={t("admin.testimonials.hintShort")}
        actions={
          <Button type="button" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            {t("admin.testimonials.add")}
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-10 min-w-[220px] max-w-[560px] flex-1 items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.testimonials.searchPlaceholder")}
            aria-label={t("admin.testimonials.searchPlaceholder")}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen(allOpen ? new Set() : new Set(visible.map((r) => r.id)))}
        >
          <ChevronsUpDown className="h-4 w-4" strokeWidth={1.75} />
          {allOpen ? t("admin.testimonials.collapseAll") : t("admin.testimonials.expandAll")}
        </Button>
        <p className="ml-auto text-sm text-muted-foreground">
          {t("admin.testimonials.summary", { count: rows.length, home: onHome.length })}
        </p>
      </div>

      {creating ? (
        <TestimonialForm
          initial={toDraft()}
          locales={locales}
          onSave={save}
          onCancel={() => setCreating(false)}
          homeFull={homeFullFor()}
        />
      ) : null}

      {rows.length === 0 ? (
        <AdminEmptyState icon={Quote} title={t("admin.testimonials.empty")} />
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("admin.testimonials.noMatches")}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius)] border border-border bg-card">
          {visible.map((row) => {
            const expanded = open.has(row.id);
            const name = row.author_name || t("admin.confirm.untitled");
            return (
              <li key={row.id}>
                <TestimonialRow
                  row={row}
                  locale={locales[0]}
                  expanded={expanded}
                  canReorder={canReorder}
                  onToggle={() => toggle(row.id)}
                  onDragStart={() => (dragged.current = row.id)}
                  onDrop={() => dragged.current && moveTo(dragged.current, row.id)}
                  onMoveStep={(d) => step(row.id, d)}
                />
                {expanded ? (
                  <div className="space-y-3 border-t border-border bg-background p-4">
                    <TestimonialForm
                      initial={toDraft(row)}
                      locales={locales}
                      onSave={save}
                      onCancel={() => toggle(row.id)}
                      homeFull={homeFullFor(row.id)}
                    />
                    {canDelete ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setPendingDelete({ id: row.id, name })}
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("admin.testimonials.delete")}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => (o ? null : setPendingDelete(null))}
        title={t("admin.testimonials.confirmDeleteTitle")}
        description={t("admin.testimonials.confirmDeleteBody", { name: pendingDelete?.name ?? "" })}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteTestimonial({ data: { id: pendingDelete.id } });
          await refresh();
        }}
      />
    </div>
  );
}

