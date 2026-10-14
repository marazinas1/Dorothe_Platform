import { useTranslation } from "react-i18next";
import { Check, Loader2, Send, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { AutosaveState } from "./use-listing-autosave";
import type { Checklist } from "@/lib/listings/publish-checklist";
import { blockerSummary } from "@/lib/listings/blocker-summary";
import { useStatusChange } from "./use-status-change";

/**
 * Sticky bar at the bottom of the listing form: autosave status on the left,
 * save and publish on the right. Publishing here follows the same rules as
 * the status bar on top — a checklist-blocked publish explains what is
 * missing instead of calling the database.
 */
export function SaveBar({
  dirty,
  saving,
  autosave,
  onSave,
  listingId,
  status,
  dealType,
  checklist,
  onStatusChanged,
}: {
  dirty: boolean;
  saving: boolean;
  autosave: AutosaveState;
  onSave: () => void;
  listingId: string | null;
  status: string | null;
  dealType: string;
  checklist: Checklist;
  onStatusChanged: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { apply, busy } = useStatusChange(onStatusChanged);

  // The autosave timestamp is operator feedback, not listing content, so it
  // correctly follows the interface language.
  const time = autosave.at
    ? new Intl.DateTimeFormat(i18n.language, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(autosave.at)
    : "";

  const isPublic = status === "active" || status === "coming_soon";
  const blocking = checklist.items.filter((item) => !item.done);
  const canPublish =
    !!listingId && !isPublic && !dirty && !saving && busy === null;

  function handlePublish() {
    if (blocking.length > 0) {
      toast.error(`${t("admin.listings.publishBlocked")} ${blockerSummary(t, blocking)}`);
      return;
    }
    void apply(listingId as string, "active");
  }

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-card/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {autosave.status === "saving" || saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("admin.listings.autosave.saving")}
            </>
          ) : autosave.status === "error" ? (
            <>
              <TriangleAlert className="h-3.5 w-3.5 text-destructive" />
              {t("admin.listings.autosave.failed")}
            </>
          ) : dirty ? (
            t("admin.listings.unsaved")
          ) : autosave.status === "saved" ? (
            <>
              <Check className="h-3.5 w-3.5" />
              {t("admin.listings.autosave.saved", { time })}
            </>
          ) : null}
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" disabled={saving} onClick={onSave}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t("admin.listings.save")}
          </Button>
          {!isPublic && listingId ? (
            <Button
              type="button"
              size="sm"
              disabled={!canPublish}
              onClick={handlePublish}
            >
              {busy === "active" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t("admin.listings.publish")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
