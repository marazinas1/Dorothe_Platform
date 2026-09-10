import { useState } from "react";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-permission";

type Props = {
  locked: number;
  total: number;
  onLockAll: () => Promise<void> | void;
};

/**
 * Developer-only header of a copy editor: how many fields already have a frozen
 * default, and one action that freezes the wording the page shows right now.
 */
export function LockAllDefaultsBar({ locked, total, onLockAll }: Props) {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const [busy, setBusy] = useState(false);

  if (user?.profile?.role !== "developer") return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[calc(var(--radius)/1.5)] border border-border bg-muted/40 px-3 py-2">
      <span className="text-xs text-muted-foreground">
        {t("admin.copyEditor.lockedCount", { locked, total })}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onLockAll();
          } finally {
            setBusy(false);
          }
        }}
      >
        <Lock className="h-3.5 w-3.5" />
        {t("admin.copyEditor.lockAll")}
      </Button>
    </div>
  );
}
