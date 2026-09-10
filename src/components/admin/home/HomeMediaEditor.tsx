import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ui/ImageUploadField";
import { pageMediaPath } from "@/lib/branding/media-paths";
import type { HomeMediaSlot } from "@/lib/home/layout";

type Entry = { mode: "default" | "custom"; url: string };

type Props = {
  slots: HomeMediaSlot[];
  entry: (slot: string) => Entry;
  onChange: (slot: string, next: Entry) => void;
  /** What the page shows today when the slot is left on "default". */
  resolved: (slot: string) => string | null;
  /** Folder these photographs belong to (home page or a named page). */
  scope?: string;
};

/**
 * Photograph slots. Every slot keeps a working default, so choosing your own
 * picture is an option and never a requirement — and the picture is uploaded
 * straight from the computer, exactly like a listing photograph.
 */
export function HomeMediaEditor({ slots, entry, onChange, resolved, scope = "home" }: Props) {
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
              <div className="mt-3">
                <ImageUploadField
                  path={pageMediaPath(scope, slot)}
                  onUploaded={(url) => onChange(slot, { mode: "custom", url: url ?? "" })}
                  removable={Boolean(value.url)}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
