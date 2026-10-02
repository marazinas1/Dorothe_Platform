import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, ImageOff, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { downloadFile } from "@/lib/download";
import { processImageFile } from "@/lib/images/optimize";
import {
  SITE_ASSETS_BUCKET,
  brandAssetPath,
  siteAssetUrl,
  type BrandAssetKind,
} from "@/lib/branding/media-paths";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface Props {
  kind: BrandAssetKind;
  label: string;
  help?: string;
  value: string | null;
  downloadName: string;
  onChange: (url: string | null) => void;
  /** Dark logos sit on a dark plate so they stay visible while choosing. */
  dark?: boolean;
  /** Square frame for icon-shaped images such as the browser icon. */
  square?: boolean;
  /** Optional entity-owned storage path for non-brand photographs. */
  pathForVariant?: (variant: string) => string;
}

/**
 * One brand image, presented the way the admin presents every picture: a real
 * preview box, one clear upload button, and a quiet remove shown only once a
 * picture of your own is in place.
 */
export function BrandAssetField({
  kind,
  label,
  help,
  value,
  downloadName,
  onChange,
  dark,
  square,
  pathForVariant,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const processed = await processImageFile(file);
      // The largest variant available keeps logos crisp on retina screens.
      const variant =
        processed.variants.find((v) => v.key === "detail") ?? processed.variants[0]!;
      const path = pathForVariant?.(variant.key) ?? brandAssetPath(kind, variant.key);
      const { error: uploadError } = await supabase.storage
        .from(SITE_ASSETS_BUCKET)
        .upload(path, variant.blob, { contentType: "image/webp", upsert: true });
      if (uploadError) throw new Error(uploadError.message);
      onChange(`${siteAssetUrl(SUPABASE_URL, path)}?v=${Date.now()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!value) return;
    try {
      await downloadFile(value, downloadName);
    } catch {
      toast.error(t("admin.settings.brand.downloadError"));
    }
  }

  return (
    <div className="space-y-3 rounded-[var(--radius)] border border-border bg-card p-5">
      <div>
        <Label className="text-sm font-bold">{label}</Label>
        {help ? <p className="mt-1 text-xs text-muted-foreground">{help}</p> : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />

      <div
        className={`admin-media-frame h-28 w-full p-4 ${dark ? "bg-primary" : "bg-muted"}`}
      >
          {value ? (
            <img
              src={value}
              alt=""
              className={square ? "h-16 w-16 object-contain" : "max-h-20 max-w-full object-contain"}
            />
          ) : (
            <ImageOff className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          )}
      </div>
      <div className="flex min-h-9 flex-wrap items-center gap-2">
        <Button type="button" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {value ? t("admin.settings.brand.replace") : t("admin.settings.brand.upload")}
        </Button>
        {value ? (
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void download()}>
            <Download className="h-3.5 w-3.5" />
            {t("admin.settings.brand.download")}
          </Button>
        ) : null}
        {value ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onChange(null)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("admin.settings.brand.remove")}
          </Button>
        ) : null}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

