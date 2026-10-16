import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnsavedChangesGuard } from "@/components/admin/ui/UnsavedChangesGuard";
import { saveInquiryNote, setInquiryStatus } from "@/lib/inquiries/admin.functions";
import { INQUIRY_STATUSES, type AdminInquiryRow, type InquiryStatus } from "@/lib/inquiries/types";

function waLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

/** Right-hand card: contact facts, status, reply actions and team-only note. */
export function InquiryWorkflow({ inquiry }: { inquiry: AdminInquiryRow }) {
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

  const facts: [string, string][] = [
    [t("admin.inquiries.detail.email"), inquiry.email],
    ...(inquiry.phone ? [[t("admin.inquiries.detail.phone"), inquiry.phone] as [string, string]] : []),
    [t("admin.inquiries.detail.source"), inquiry.source ? t(`admin.inquiries.sources.${inquiry.source}`, { defaultValue: inquiry.source }) : "—"],
    [t("admin.inquiries.detail.locale"), inquiry.locale?.toUpperCase() ?? "—"],
  ];

  return (
    <section className="space-y-5 rounded-[var(--radius)] border border-border bg-card p-5">
      <UnsavedChangesGuard dirty={dirty} />
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
        {facts.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="break-words">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-2">
        <Label htmlFor="inquiry-status">{t("admin.inquiries.detail.workflow")}</Label>
        <Select
          value={inquiry.status}
          disabled={status.isPending}
          onValueChange={(v) => v !== inquiry.status && status.mutate(v as InquiryStatus)}
        >
          <SelectTrigger id="inquiry-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            {INQUIRY_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{t(`admin.inquiries.status.${s}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Button asChild>
          <a href={`mailto:${inquiry.email}`}>
            <Mail className="h-4 w-4" />
            {t("admin.inquiries.detail.reply_mail_app")}
          </a>
        </Button>
        {inquiry.phone ? (
          <>
            <Button asChild variant="outline">
              <a href={`tel:${inquiry.phone}`}>
                <Phone className="h-4 w-4" />
                {t("admin.inquiries.detail.call", { phone: inquiry.phone })}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={waLink(inquiry.phone)} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                {t("admin.inquiries.detail.whatsapp")}
              </a>
            </Button>
          </>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiry-note">{t("admin.inquiries.detail.note")}</Label>
        <Textarea id="inquiry-note" rows={5} maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} />
        <p className="text-xs text-muted-foreground">{t("admin.inquiries.detail.note_hint")}</p>
        <Button type="button" size="sm" variant="outline" disabled={!dirty || saveNote.isPending} onClick={() => saveNote.mutate()}>
          {t("admin.inquiries.detail.note_save")}
        </Button>
      </div>
    </section>
  );
}
