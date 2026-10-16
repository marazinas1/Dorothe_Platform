import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { UnsavedChangesGuard } from "@/components/admin/ui/UnsavedChangesGuard";
import { inquiryRepliesQueryOptions, sendInquiryReply } from "@/lib/inquiries/reply.functions";
import type { AdminInquiryRow } from "@/lib/inquiries/types";
import { formatInquiryDate } from "./InquiryBadges";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";

const card = "rounded-[var(--radius)] border border-border bg-card";

/** Sent replies plus the composer that emails the enquirer directly. */
export function InquiryReplies({ inquiry, locale }: { inquiry: AdminInquiryRow; locale: string }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const send = useServerFn(sendInquiryReply);
  const replies = useQuery(inquiryRepliesQueryOptions(inquiry.id));
  const settings = useQuery(siteSettingsQueryOptions);
  const ownEmail = (settings.data as { contact_email?: string | null } | undefined)?.contact_email;
  const [body, setBody] = useState("");
  const [confirm, setConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: () => send({ data: { id: inquiry.id, body } }),
    onSuccess: () => {
      toast.success(t("admin.inquiries.detail.reply_sent"));
      setBody("");
      void qc.invalidateQueries({ queryKey: ["admin", "inquiry", inquiry.id] });
      void qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
    onError: (e) =>
      toast.error(
        e instanceof Error && e.message === "recipient_suppressed"
          ? t("admin.inquiries.detail.reply_suppressed")
          : t("admin.inquiries.detail.reply_error"),
      ),
  });

  return (
    <section className={card}>
      <UnsavedChangesGuard dirty={body.trim().length > 0 && !mutation.isPending} />
      <h2 className="border-b border-border px-5 py-3.5 text-sm font-bold">
        {t("admin.inquiries.detail.replies")}
      </h2>
      {(replies.data ?? []).length > 0 ? (
        <ul className="divide-y divide-border">
          {replies.data!.map((r) => (
            <li key={r.id} className="space-y-1 px-5 py-3.5">
              <p className="text-xs text-muted-foreground tabular-nums">
                {t("admin.inquiries.detail.reply_sent_at", { date: formatInquiryDate(r.created_at, locale) })}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{r.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="space-y-2 border-t border-border p-5">
        <Label htmlFor="inquiry-reply">{t("admin.inquiries.detail.reply_label", { email: inquiry.email })}</Label>
        <Textarea id="inquiry-reply" rows={6} maxLength={8000} value={body} onChange={(e) => setBody(e.target.value)} />
        <p className="text-xs text-muted-foreground">{ownEmail ? t("admin.inquiries.detail.reply_hint_email", { email: ownEmail }) : t("admin.inquiries.detail.reply_hint")}</p>
        <Button type="button" disabled={!body.trim() || mutation.isPending} onClick={() => setConfirm(true)}>
          <Send className="h-4 w-4" />
          {t("admin.inquiries.detail.reply_send")}
        </Button>
      </div>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={t("admin.inquiries.detail.reply_confirm_title")}
        description={t("admin.inquiries.detail.reply_confirm_body", { email: inquiry.email })}
        confirmLabel={t("admin.inquiries.detail.reply_send")}
        onConfirm={() => mutation.mutateAsync().then(() => undefined, () => undefined)}
      />
    </section>
  );
}
