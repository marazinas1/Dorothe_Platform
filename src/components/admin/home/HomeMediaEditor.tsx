import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HomeMediaSlot } from "@/lib/home/layout";

type Entry = { mode: "default" | "custom"; url: string };

type Props = {
  slots: HomeMediaSlot[];
  entry: (slot: string) => Entry;
  onChange: (slot: string, next: Entry) => void;
  /** What the page shows today when the slot is left on "default". */
  resolved: (slot: string) => string | null;
};

/**
 * Photograph slots. Every slot keeps a working default, so choosing your own
 * picture is an option and never a requirement.
 */
export function HomeMediaEditor({ slots, entry, onChange, resolved }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {slots.map((slot) => {
        const value = entry(slot);
        const shown = value.mode === "custom" ? value.url : resolved(slot);
        return (
          <div key={slot} className="rounded-[var(--radius)] border border-border bg-card p-4">
            <Label className="text-sm font-medium">{t(`admin.home.media.${slot}`)}</Label>

            <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius)/1.5)] bg-muted">
              {shown ? (
                <img src={shown} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  {t("admin.home.media.empty")}
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-4 text-sm">
              {(["default", "custom"] as const).map((mode) => (
                <label key={mode} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    className="accent-[var(--primary)]"
                    checked={value.mode === mode}
                    onChange={() => onChange(slot, { ...value, mode })}
                  />
                  {t(`admin.home.media.${mode}`)}
                </label>
              ))}
            </div>

            {value.mode === "custom" ? (
              <Input
                className="mt-3"
                value={value.url}
                placeholder="https://…"
                onChange={(e) => onChange(slot, { mode: "custom", url: e.target.value })}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
