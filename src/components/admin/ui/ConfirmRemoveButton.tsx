import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "./ConfirmDialog";

type Props = {
  /** What is being removed, as the owner calls it (e.g. "Logo for dark backgrounds"). */
  name: string;
  label: string;
  disabled?: boolean;
  onConfirm: () => void | Promise<void>;
};

/** Quiet remove button that always asks first, so one stray click never deletes anything. */
export function ConfirmRemoveButton({ name, label, disabled, onConfirm }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => setOpen(true)}>
        <Trash2 className="h-3.5 w-3.5" />
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("admin.confirm.removeTitle", { name })}
        description={t("admin.confirm.removeBody", { name })}
        confirmLabel={t("admin.confirm.removeAction")}
        onConfirm={onConfirm}
      />
    </>
  );
}
