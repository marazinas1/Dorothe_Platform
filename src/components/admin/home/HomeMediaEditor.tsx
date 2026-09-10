import { useTranslation } from "react-i18next";

import { ImageOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <div key={slot} className="overflow-hidden rounded-[0.875rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-3.5">
              <Label className="text-sm font-bold">{t(`admin.home.media.${slot}`)}</Label>
              <p className="mt-1 text-xs text-muted-foreground">{t("admin.home.media.uploadHelp")}</p>
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden bg-accent">
              {shown ? (
                <img src={shown} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ImageOff className="h-6 w-6" />
                  <span>{t("admin.home.media.empty")}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 p-5">
              <p className="text-xs text-muted-foreground">
                {value.mode === "custom"
                  ? t("admin.home.media.custom")
                  : t("admin.home.media.default")}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <ImageUploadField
                  path={pageMediaPath(scope, slot)}
                  onUploaded={(url) =>
                    onChange(slot, url ? { mode: "custom", url } : { mode: "default", url: "" })
                  }
                  removable={false}
                  replace={value.mode === "custom"}
                />
                {value.mode === "custom" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange(slot, { mode: "default", url: "" })}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t("admin.home.media.restoreDefault")}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

        );
      })}
    </div>
  );
}
