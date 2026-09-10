import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { useDefaultRequests } from "@/lib/copy-requests/use-default-requests";

type Props = { requests: ReturnType<typeof useDefaultRequests> };

/**
 * What came of the wording the broker sent for approval: one short line per
 * decision, dismissed once read.
 */
export function DefaultRequestNotices({ requests }: Props) {
  const { t } = useTranslation();
  const notices = requests.notices;
  if (notices.length === 0) return null;

  return (
    <div className="grid gap-2">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="flex items-start justify-between gap-2 rounded-[calc(var(--radius)/1.5)] border border-border bg-muted/40 px-3 py-2"
        >
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            {notice.status === "approved" ? (
              <Check className="mt-0.5 h-3.5 w-3.5" />
            ) : (
              <X className="mt-0.5 h-3.5 w-3.5" />
            )}
            <span>
              {t(`admin.copyEditor.request.notice.${notice.status}`, {
                field: notice.field_key,
                locale: notice.locale.toUpperCase(),
              })}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => void requests.dismissNotices([notice.id])}
          >
            {t("admin.copyEditor.request.dismiss")}
          </Button>
        </div>
      ))}
    </div>
  );
}
