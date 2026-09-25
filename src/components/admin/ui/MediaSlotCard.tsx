import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChevronDown, ImageIcon, Lock, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth/use-permission";
import type { MediaSource, ResolvedMedia } from "@/lib/media/slots";
import { cn } from "@/lib/utils";

import { ImageUploadField } from "./ImageUploadField";

type Props = {
  label: string;
  help: string;
  aspect: string;
  media: ResolvedMedia;
  uploadPath: string;
  studioPath: string;
  onChoose: (url: string | null) => void | Promise<void>;
  onStudio: (url: string | null) => Promise<void>;
};

/**
 * One editable photograph: collapsed summary, expanded three layers in fixed
 * order — Your choice, Studio default, Built-in — with the active one marked.
 */
export function MediaSlotCard({ label, help, aspect, media, uploadPath, studioPath, onChoose, onStudio }: Props) {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const isDeveloper = user?.profile?.role === "developer";
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const m = (k: string) => t(`admin.media.${k}`);

  async function run(action: () => void | Promise<void>, done: string) {
    setBusy(true);
    try {
      await action();
      toast.success(done);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : m("error"));
    } finally {
      setBusy(false);
    }
  }

  const tiles: { key: MediaSource; title: string; url: string | null; empty: string }[] = [
    { key: "chosen", title: m("yourChoice"), url: media.chosen, empty: m("noChoice") },
    { key: "default", title: m("studioDefault"), url: media.studio, empty: m("noStudio") },
    { key: "builtIn", title: m("builtIn"), url: media.builtIn, empty: m("noBuiltIn") },
  ];

  return (
    <div className="min-w-0 rounded-[var(--radius)] border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Thumb src={media.url} className="h-14 w-20" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{m(`showing_${media.source}`)}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius)] border border-border px-2 py-1 text-xs">
          {open ? t("admin.common.close") : t("admin.common.edit")}
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </span>
      </button>

      {open ? (
        <div className={cn("space-y-4 border-t border-border p-3", busy && "opacity-70")} aria-busy={busy}>
          <p className="text-xs text-muted-foreground">{help}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tiles.map((tile) => {
              const showing = media.source === tile.key;
              return (
                <div key={tile.key} className={cn("min-w-0 rounded-[var(--radius)] border p-2", showing ? "border-foreground" : "border-border")}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="admin-label text-muted-foreground">{tile.title}</span>
                    {showing ? <Badge>{m("showing")}</Badge> : null}
                  </div>
                  <Thumb src={tile.url} className={cn("w-full", aspect)} empty={tile.empty} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-start gap-2">
            <ImageUploadField
              path={uploadPath}
              removable={false}
              replace={Boolean(media.chosen)}
              onUploaded={(url) => void run(() => onChoose(url), m("saved"))}
            />
            {media.chosen ? (
              <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run(() => onChoose(null), m("reset"))}>
                <RotateCcw className="h-3.5 w-3.5" />
                {m("resetToDefault")}
              </Button>
            ) : null}
          </div>

          {isDeveloper ? (
            <div className="flex flex-wrap items-start gap-2 border-t border-border pt-3">
              <span className="admin-label self-center text-muted-foreground">{m("studioDefault")}</span>
              <ImageUploadField
                path={studioPath}
                removable={false}
                replace={Boolean(media.studio)}
                onUploaded={(url) => void run(() => onStudio(url), m("studioSaved"))}
              />
              {media.studio ? (
                <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => void run(() => onStudio(null), m("studioCleared"))}>
                  {m("clearStudio")}
                </Button>
              ) : null}
            </div>
          ) : (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              {m("studioLocked")}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Thumb({ src, className, empty }: { src: string | null; className: string; empty?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] bg-muted", className)}>
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : empty ? (
        <span className="px-3 text-center text-xs text-muted-foreground">{empty}</span>
      ) : (
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}
