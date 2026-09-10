import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { processImageFile } from "@/lib/images/optimize";
import {
  POST_IMAGES_BUCKET,
  postCoverPath,
  postImageUrl,
} from "@/lib/posts/media-paths";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface Props {
  /** Current cover URL, empty when the article has none yet. */
  value: string | null;
  onChange: (url: string | null) => void;
  /** Saves the draft if needed and returns the article id to file the image under. */
  ensurePostId: () => Promise<string>;
}

/**
 * Article cover, same pipeline as listing photos: resize + WebP encode in the
 * browser, upload the variants to the public post-images bucket, keep the
 * detail-sized URL on the article.
 */
export function CoverUploader({ value, onChange, ensurePostId }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const postId = await ensurePostId();
      const processed = await processImageFile(file);
      let detailUrl: string | null = null;

      for (const variant of processed.variants) {
        const path = postCoverPath(postId, variant.key);
        const { error: uploadError } = await supabase.storage
          .from(POST_IMAGES_BUCKET)
          .upload(path, variant.blob, { contentType: "image/webp", upsert: true });
        if (uploadError) throw new Error(uploadError.message);
        if (variant.key === "detail") detailUrl = postImageUrl(SUPABASE_URL, path);
      }

      const chosen =
        detailUrl ??
        postImageUrl(SUPABASE_URL, postCoverPath(postId, processed.variants[0]!.key));
      // Cache-bust so a replaced cover shows up straight away.
      onChange(`${chosen}?v=${Date.now()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{t("admin.posts.cover")}</Label>

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
          <img
            src={value}
            alt=""
            className="h-24 w-36 shrink-0 object-cover"
            loading="lazy"
          />
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
              {t("admin.posts.coverReplace")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => onChange(null)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("admin.posts.coverRemove")}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-border bg-muted/20 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/40 disabled:cursor-progress"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="text-sm">{t("admin.posts.coverUpload")}</span>
          <span className="text-xs text-muted-foreground">
            {t("admin.posts.coverHint")}
          </span>
        </button>
      )}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
