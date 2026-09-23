import { useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import {
  adminTestimonialsQueryOptions,
  deleteTestimonial,
  moveTestimonial,
  saveTestimonial,
} from "@/lib/testimonials/admin.functions";

import { TestimonialForm, toDraft, type TestimonialDraft } from "./TestimonialForm";
import { TestimonialRow } from "./TestimonialRow";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";

/** Client voices: add, edit, order, and decide what the home page shows. */
export function TestimonialsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: rows } = useSuspenseQuery(adminTestimonialsQueryOptions);
  const [editing, setEditing] = useState<TestimonialDraft | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const enabled = (settings.enabled_locales ?? []).filter(Boolean);
  const locales = enabled.length > 0 ? enabled : [settings.default_locale];

  async function refresh() {
    await qc.invalidateQueries({ queryKey: adminTestimonialsQueryOptions.queryKey });
  }

  async function save(draft: TestimonialDraft) {
    await saveTestimonial({ data: draft });
    await refresh();
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader icon={Quote} title={t("admin.testimonials.title")} description={t("admin.testimonials.hint")} actions={<Button type="button" onClick={() => setEditing(toDraft())}>
          <Plus className="h-4 w-4" />
          {t("admin.testimonials.add")}
        </Button>} />

      {editing && !editing.id ? (
        <TestimonialForm
          initial={editing}
          locales={locales}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {rows.length === 0 ? (
        <AdminEmptyState icon={Quote} title={t("admin.testimonials.empty")} />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const expanded = editing?.id === row.id;
            return (
              <li key={row.id} className="space-y-3">
                <TestimonialRow
                  row={row}
                  locale={locales[0]}
                  expanded={expanded}
                  onEdit={() => setEditing(expanded ? null : toDraft(row))}
                  onDelete={() =>
                    setPendingDelete({
                      id: row.id,
                      name: row.author_name || t("admin.confirm.untitled"),
                    })
                  }
                  onMove={async (direction) => {
                    await moveTestimonial({ data: { id: row.id, direction } });
                    await refresh();
                  }}
                />
                {expanded ? (
                  <TestimonialForm
                    initial={editing ?? toDraft(row)}
                    locales={locales}
                    onSave={save}
                    onCancel={() => setEditing(null)}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => (open ? null : setPendingDelete(null))}
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
