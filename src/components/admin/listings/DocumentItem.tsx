import { useEffect, useState, type ReactNode } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { downloadFile } from "@/lib/download";
import { DOCUMENTS_BUCKET } from "@/lib/listings/media-paths";
import type { AdminDocument } from "@/lib/listings/use-listing-files";

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

/** One stored document: preview for image plans, download and remove. */
export function DocumentItem({ doc, onRemove, children }: { doc: AdminDocument; onRemove: () => void; children?: ReactNode }) {
  const { t } = useTranslation();
  const isImage = IMAGE_EXT.test(doc.storage_path);
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!isImage) return;
    let live = true;
    void supabase.storage.from(DOCUMENTS_BUCKET).createSignedUrl(doc.storage_path, 3600)
      .then(({ data }) => { if (live) setThumb(data?.signedUrl ?? null); });
    return () => { live = false; };
  }, [doc.storage_path, isImage]);

  async function download() {
    try {
      const { data, error } = await supabase.storage.from(DOCUMENTS_BUCKET).createSignedUrl(doc.storage_path, 60);
      if (error || !data) throw error ?? new Error("sign");
      await downloadFile(data.signedUrl, doc.filename);
    } catch {
      toast.error(t("admin.settings.brand.downloadError"));
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-2">
      <a href={thumb ?? undefined} target="_blank" rel="noopener noreferrer"
        className="admin-media-frame size-14 shrink-0 bg-muted" aria-label={doc.filename}>
        {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" />
          : <FileText aria-hidden strokeWidth={1.75} className="size-5 text-muted-foreground" />}
      </a>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="block truncate text-sm">{doc.filename}</span>
        {children}
      </span>
      <Button type="button" variant="ghost" size="sm" onClick={() => void download()}
        aria-label={`${t("admin.settings.brand.download")}: ${doc.filename}`} title={t("admin.settings.brand.download")}>
        <Download aria-hidden strokeWidth={1.75} className="size-4" />
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onRemove}
        aria-label={`${t("admin.listings.docs.remove")}: ${doc.filename}`} title={t("admin.listings.docs.remove")}>
        <Trash2 aria-hidden strokeWidth={1.75} className="size-4" />
      </Button>
    </li>
  );
}
