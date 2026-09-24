import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, ImageOff, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/ui/ImageUploadField";
import { pageMediaPath } from "@/lib/branding/media-paths";
import type { HomeMediaSlot } from "@/lib/home/layout";
import { cn } from "@/lib/utils";

type Entry = { mode: "default" | "custom"; url: string };

type Props = {
  slots: HomeMediaSlot[];
  entry: (slot: string) => Entry;
  onChange: (slot: string, next: Entry) => void;
  resolved: (slot: string) => string | null;
  scope?: string;
};

export function HomeMediaEditor({ slots, entry, onChange, resolved, scope = "home" }: Props) {
  const { t } = useTranslation();
  const [openSlot, setOpenSlot] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const value = entry(slot);
        const fallback = resolved(slot);
        const shown = value.mode === "custom" ? value.url : fallback;
        const open = openSlot === slot;
        return (
          <section key={slot} className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
            <div className="flex items-center gap-3 p-4">
              <MediaPreview src={shown} className="h-14 w-20" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{t(`admin.home.media.${slot}`)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {value.mode === "custom" ? t("admin.home.media.custom") : t("admin.home.media.default")}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-expanded={open}
                onClick={() => setOpenSlot(open ? null : slot)}
              >
                {open ? t("admin.common.close") : t("admin.common.edit")}
                <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
              </Button>
            </div>

            {open ? (
              <div className="space-y-4 border-t border-border p-4">
                <p className="text-xs text-muted-foreground">{t("admin.home.media.uploadHelp")}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <MediaLayer label={t("admin.home.media.yourChoice")} src={value.url || null} active={value.mode === "custom"} />
                  <MediaLayer label={t("admin.home.media.studioDefault")} src={null} active={false} />
                  <MediaLayer label={t("admin.home.media.builtIn")} src={fallback} active={value.mode !== "custom"} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ImageUploadField
                    path={pageMediaPath(scope, slot)}
                    onUploaded={(url) => onChange(slot, url ? { mode: "custom", url } : { mode: "default", url: "" })}
                    removable={false}
                    replace={value.mode === "custom"}
                  />
                  {value.mode === "custom" ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => onChange(slot, { mode: "default", url: "" })}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      {t("admin.home.media.restoreDefault")}
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function MediaLayer({ label, src, active }: { label: string; src: string | null; active: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-[var(--radius)] border border-border bg-muted/40 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="admin-label text-muted-foreground">{label}</span>
        {active ? <span className="inline-flex items-center gap-1 text-xs font-medium"><Check className="h-3.5 w-3.5" />{t("admin.home.media.showing")}</span> : null}
      </div>
      <MediaPreview src={src} className="aspect-[4/3] w-full" />
    </div>
  );
}

function MediaPreview({ src, className }: { src: string | null; className: string }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] bg-muted", className)}>
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <ImageOff className="h-5 w-5 text-muted-foreground" />}
    </div>
  );
}