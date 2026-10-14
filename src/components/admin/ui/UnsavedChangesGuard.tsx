import { useEffect, useRef } from "react";
import { useBlocker } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "./ConfirmDialog";

/**
 * Keeps typed-but-unsaved edits from disappearing: warns on browser navigation
 * and asks inside the panel before leaving the page. Only real page changes
 * are blocked — same-page moves (section anchors, search params) and
 * navigations the form starts itself (`allowNavigation`) pass through.
 */
export function UnsavedChangesGuard({
  dirty,
  allowNavigation,
}: {
  dirty: boolean;
  /** Return true for a navigation the form itself triggers (e.g. after save). */
  allowNavigation?: () => boolean;
}) {
  const { t } = useTranslation();
  // Refs, so the blocker never decides on a stale render's values.
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const allowRef = useRef(allowNavigation);
  allowRef.current = allowNavigation;

  const { status, proceed, reset } = useBlocker({
    shouldBlockFn: ({ current, next }) => {
      if (!dirtyRef.current) return false;
      if (allowRef.current?.()) return false;
      return current.pathname !== next.pathname;
    },
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
