import { Lock, Undo2 } from "lucide-react";

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
  /** The wording the page falls back to, shown greyed out. */
  placeholder: string;
  onChange: (next: string) => void;
  onReset: () => void;
  onSetDefault: () => void;
  /** Wording of the two actions, supplied by the page's own editor. */
  resetLabel: string;
  setDefaultLabel: string;
};

/**
 * One editable line of the public site. The field itself stays empty while the
 * page uses its default wording, and prints that default greyed out, so nothing
 * has to be retyped to be kept. Freezing new wording as the default is a
 * developer act.
 */
export function DefaultTextField({
  id,
  label,
  kind,
  value,
  placeholder,
  onChange,
  onReset,
  onSetDefault,
  resetLabel,
  setDefaultLabel,
}: Props) {
  const user = useCurrentUser();
  const isDeveloper = user?.profile?.role === "developer";

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-sm">
          {label}
        </Label>
        <div className="flex items-center gap-1">
          {value.trim().length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onReset}
            >
              <Undo2 className="h-3 w-3" />
              {resetLabel}
            </Button>
          ) : null}
          {isDeveloper ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onSetDefault}
            >
              <Lock className="h-3 w-3" />
              {setDefaultLabel}
            </Button>
          ) : null}
        </div>
      </div>
      {kind === "line" ? (
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Textarea
          id={id}
          rows={kind === "list" ? 4 : 3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
