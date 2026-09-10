import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { processImageFile } from "@/lib/images/optimize";
import { SITE_ASSETS_BUCKET, siteAssetUrl } from "@/lib/branding/media-paths";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface Props {
  /** Storage path inside the public site assets bucket. */
  path: string;
  /** Called with the public URL once the upload finished, or null on removal. */
  onUploaded: (url: string | null) => void;
  /** Hide the remove button where a picture cannot be cleared. */
  removable?: boolean;
  /** Wording: a picture of your own is already in place. */
  replace?: boolean;
  busyLabel?: string;
}

/**
 * Picking a picture from the computer, optimised in the browser and filed at a
 * stable path — the same flow used for listing photographs.
 */
export function ImageUploadField({ path, onUploaded, removable = true, replace }: Props) {

  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const processed = await processImageFile(file);
      const variant =
        processed.variants.find((v) => v.key === "detail") ?? processed.variants[0]!;
      const { error: uploadError } = await supabase.storage
        .from(SITE_ASSETS_BUCKET)
        .upload(path, variant.blob, { contentType: "image/webp", upsert: true });
      if (uploadError) throw new Error(uploadError.message);
      onUploaded(`${siteAssetUrl(SUPABASE_URL, path)}?v=${Date.now()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
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
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {t("admin.settings.brand.upload")}
        </Button>
        {removable ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onUploaded(null)}
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
