import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UnsavedChangesGuard } from "@/components/admin/ui/UnsavedChangesGuard";
import { saveInquiryNote, setInquiryStatus } from "@/lib/inquiries/admin.functions";
import { INQUIRY_STATUSES, type AdminInquiryRow, type InquiryStatus } from "@/lib/inquiries/types";
import { cn } from "@/lib/utils";
import { formatInquiryDate } from "./InquiryBadges";

/** Status, team-only note and the timeline of one enquiry. */
export function InquiryWorkflow({ inquiry, locale }: { inquiry: AdminInquiryRow; locale: string }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const updateStatus = useServerFn(setInquiryStatus);
  const updateNote = useServerFn(saveInquiryNote);
  const [note, setNote] = useState(inquiry.internal_note);
  const dirty = note.trim() !== inquiry.internal_note.trim();

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin", "inquiry", inquiry.id] });
    void qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const status = useMutation({
    mutationFn: (next: InquiryStatus) => updateStatus({ data: { id: inquiry.id, status: next } }),
    onSuccess: () => {
      toast.success(t("admin.inquiries.detail.status_saved"));
      refresh();
    },
    onError: () => toast.error(t("admin.inquiries.detail.status_error")),
  });

  const saveNote = useMutation({
    mutationFn: () => updateNote({ data: { id: inquiry.id, note } }),
    onSuccess: () => {
      toast.success(t("admin.inquiries.detail.note_saved"));
      refresh();
    },
    onError: () => toast.error(t("admin.inquiries.detail.note_error")),
  });

  const history = [
    { key: "received", label: t("admin.inquiries.detail.history_received"), at: inquiry.created_at },
    { key: "opened", label: t("admin.inquiries.detail.history_opened"), at: inquiry.read_at },
    {
      key: "closed",
      label: t("admin.inquiries.detail.history_closed"),
      at: inquiry.status === "closed" ? inquiry.handled_at : null,
    },
  ].filter((h): h is { key: string; label: string; at: string } => Boolean(h.at));

  return (
    <section className="grid gap-6 rounded-[var(--radius)] border border-border bg-card p-4 lg:grid-cols-[1fr_1fr]">
      <UnsavedChangesGuard dirty={dirty} />
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="admin-section-title">{t("admin.inquiries.detail.workflow")}</h2>
          <div role="radiogroup" aria-label={t("admin.inquiries.detail.workflow")} className="flex flex-wrap gap-2">
            {INQUIRY_STATUSES.map((s) => (
              <Button
                key={s}
                type="button"
                size="sm"
                role="radio"
                aria-checked={inquiry.status === s}
                variant={inquiry.status === s ? "default" : "outline"}
                disabled={status.isPending}
                onClick={() => inquiry.status !== s && status.mutate(s)}
              >
                {t(`admin.inquiries.status.${s}`)}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="admin-section-title">{t("admin.inquiries.detail.history")}</h2>
          <ol className="space-y-1 text-sm">
            {history.map((h) => (
              <li key={h.key} className="flex gap-3">
                <span className="w-32 text-muted-foreground">{h.label}</span>
                <span>{formatInquiryDate(h.at, locale)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inquiry-note">{t("admin.inquiries.detail.note")}</Label>
        <Textarea
          id="inquiry-note"
          rows={5}
          maxLength={4000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t("admin.inquiries.detail.note_hint")}</p>
        <Button
          type="button"
          size="sm"
          className={cn(!dirty && "opacity-60")}
          disabled={!dirty || saveNote.isPending}
          onClick={() => saveNote.mutate()}
        >
          {t("admin.inquiries.detail.note_save")}
        </Button>
      </div>
    </section>
  );
}
