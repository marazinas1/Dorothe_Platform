import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
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
  onChange: (url: string | null) => void;
  /** Dark logos sit on a dark plate so they stay visible while choosing. */
  dark?: boolean;
}

/**
 * One brand image: uploaded straight from the computer, optimised in the
 * browser and filed under a stable path so replacing it updates the whole site.
 */
export function BrandAssetField({ kind, label, help, value, onChange, dark }: Props) {
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
      const path = brandAssetPath(kind, variant.key);
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

  return (
    <div className="space-y-2 rounded-[var(--radius)] border border-border p-4">
      <div>
        <Label>{label}</Label>
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

      {value ? (
        <div className="flex items-start gap-3">
          <div
            className={`flex aspect-[4/3] w-36 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-border p-3 ${
              dark ? "bg-foreground" : "bg-muted/30"
            }`}
          >
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {t("admin.settings.brand.replace")}
            </Button>
            <Button
              type="button"
              size="sm"
          variant="outline"
              disabled={busy}
              onClick={() => onChange(null)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("admin.settings.brand.remove")}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius)] border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50 disabled:cursor-progress"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="text-sm">{t("admin.settings.brand.upload")}</span>
        </button>
      )}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
