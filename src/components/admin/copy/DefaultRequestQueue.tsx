import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-permission";
import {
  defaultTextRequestsQueryOptions,
  resolveDefaultTextRequest,
} from "@/lib/copy-requests/requests.functions";

/**
 * Developer-only work queue: wording the broker asked to lock in as the default.
 * Approving writes the default and clears the override in one step.
 */
export function DefaultRequestQueue() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const user = useCurrentUser();
  const { data: all = [] } = useQuery(defaultTextRequestsQueryOptions);
  const [busy, setBusy] = useState<string | null>(null);

  if (user?.profile?.role !== "developer") return null;
  const pending = all.filter((r) => r.status === "pending");
  if (pending.length === 0) return null;

  async function resolve(id: string, approve: boolean) {
    setBusy(id);
    try {
      await resolveDefaultTextRequest({ data: { id, approve } });
      await qc.invalidateQueries({ queryKey: defaultTextRequestsQueryOptions.queryKey });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card p-4">
      <h2 className="font-heading text-lg">{t("admin.copyEditor.request.queueHeading")}</h2>
      <div className="mt-3 grid gap-3">
        {pending.map((row) => (
          <div key={row.id} className="rounded-[calc(var(--radius)/1.5)] border border-border p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {(row.scope === "home" ? t("admin.copyEditor.request.home") : (row.page ?? "-")) +
                ` · ${row.field_key} · ${row.locale.toUpperCase()}`}
            </div>
            <p className="mt-1 whitespace-pre-line text-sm">
              {Array.isArray(row.requested_text)
                ? row.requested_text.join("\n")
                : row.requested_text}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                disabled={busy === row.id}
                onClick={() => void resolve(row.id, true)}
              >
                <Check className="h-3.5 w-3.5" />
                {t("admin.copyEditor.request.approve")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy === row.id}
                onClick={() => void resolve(row.id, false)}
              >
                <X className="h-3.5 w-3.5" />
                {t("admin.copyEditor.request.decline")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
