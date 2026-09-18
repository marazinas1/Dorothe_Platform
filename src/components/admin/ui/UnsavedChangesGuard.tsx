import { useEffect } from "react";
import { useBlocker } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "./ConfirmDialog";

/**
 * Keeps typed-but-unsaved edits from disappearing: warns on browser navigation
 * and asks inside the panel before leaving the page.
 */
export function UnsavedChangesGuard({ dirty }: { dirty: boolean }) {
  const { t } = useTranslation();
  const { status, proceed, reset } = useBlocker({
    shouldBlockFn: () => dirty,
    withResolver: true,
    enableBeforeUnload: false,
  });

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return (
    <ConfirmDialog
      open={status === "blocked"}
      onOpenChange={(open) => {
        if (!open) reset?.();
      }}
      title={t("admin.unsaved.title")}
      description={t("admin.unsaved.body")}
      confirmLabel={t("admin.unsaved.leave")}
      onConfirm={() => proceed?.()}
    />
  );
}
