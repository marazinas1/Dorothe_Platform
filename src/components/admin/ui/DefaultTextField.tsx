import { useState } from "react";
import { Lock, LockOpen, Send, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-permission";

export type FieldKind = "line" | "paragraph" | "list";

type Props = {
  id: string;
  label: string;
  kind: FieldKind;
  /** Only what the broker typed — empty means "the page shows the default". */
  value: string;
  /** The wording the page falls back to, shown as plain grey text. */
  placeholder: string;
  /** True once a developer has frozen this field's default wording. */
  isLocked?: boolean;
  /** Outcome of the owner's own "make this the default" request, if any. */
  requestStatus?: "pending" | "approved" | "declined" | null;
  onChange: (next: string) => void;
  onReset: () => void;
  onSetDefault: () => void;
  /** Owner path: ask the developer to lock this wording in. */
  onRequestDefault?: () => void;
};

const COLLAPSE_AT = 180;

/**
 * One editable line of the public site. The wording the page currently shows is
 * printed above the field as plain grey text — not inside it — so it reads as a
 * reference rather than something to edit. The field itself is only ever the
 * broker's own wording. Freezing new wording as the default is a developer act.
 */
export function DefaultTextField({
  id,
  label,
  kind,
  value,
  placeholder,
  isLocked = false,
  onChange,
  onReset,
  onSetDefault,
}: Props) {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const isDeveloper = user?.profile?.role === "developer";
  const [expanded, setExpanded] = useState(false);

  const edited = value.trim().length > 0;
  const defaultText = placeholder.trim();
  const long = defaultText.length > COLLAPSE_AT;
  const shown = long && !expanded ? `${defaultText.slice(0, COLLAPSE_AT).trimEnd()}…` : defaultText;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className="text-sm">
            {label}
          </Label>
          {edited ? (
            <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("admin.copyEditor.edited")}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {edited ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onReset}
            >
              <Undo2 className="h-3 w-3" />
              {t("admin.copyEditor.reset")}
            </Button>
          ) : null}
          {isDeveloper ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onSetDefault}
              title={
                isLocked ? t("admin.copyEditor.lockedHint") : t("admin.copyEditor.unlockedHint")
              }
            >
              {isLocked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
              {t("admin.copyEditor.setDefault")}
            </Button>
          ) : null}
        </div>
      </div>

      {defaultText ? (
        <div className="rounded-[calc(var(--radius)/1.5)] border border-dashed border-border bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {isLocked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
            {edited ? t("admin.copyEditor.defaultLabel") : t("admin.copyEditor.currentlyShown")}
          </div>
          <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground/80">{shown}</p>
          {long ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-muted-foreground underline"
            >
              {expanded ? t("admin.copyEditor.showLess") : t("admin.copyEditor.showMore")}
            </button>
          ) : null}
        </div>
      ) : null}

      {kind === "line" ? (
        <Input
          id={id}
          value={value}
          placeholder={t("admin.copyEditor.writeOwn")}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Textarea
          id={id}
          rows={kind === "list" ? 4 : 3}
          value={value}
          placeholder={t("admin.copyEditor.writeOwn")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
