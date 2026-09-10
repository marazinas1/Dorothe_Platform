import { useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

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

/** Client voices: add, edit, order, and decide what the home page shows. */
export function TestimonialsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: rows } = useSuspenseQuery(adminTestimonialsQueryOptions);
  const [editing, setEditing] = useState<TestimonialDraft | null>(null);

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
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("admin.testimonials.title")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("admin.testimonials.hint")}</p>
        </div>
        <Button type="button" onClick={() => setEditing(toDraft())}>
          <Plus className="h-4 w-4" />
          {t("admin.testimonials.add")}
        </Button>
      </header>

      {editing ? (
        <TestimonialForm
          initial={editing}
          locales={locales}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("admin.testimonials.empty")}</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <TestimonialRow
              key={row.id}
              row={row}
              locale={locales[0]}
              onEdit={() => setEditing(toDraft(row))}
              onDelete={async () => {
                if (!window.confirm(t("admin.testimonials.confirmDelete"))) return;
                await deleteTestimonial({ data: { id: row.id } });
                await refresh();
              }}
              onMove={async (direction) => {
                await moveTestimonial({ data: { id: row.id, direction } });
                await refresh();
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
