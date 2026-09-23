import { useRef, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { processImageFile } from "@/lib/images/optimize";
import {
  IMAGES_BUCKET,
  ORIGINALS_BUCKET,
  originalPath,
  publicImageUrl,
  variantPath,
  type VariantsJson,
} from "@/lib/listings/media-paths";
import { recordListingImage } from "@/lib/listings/media.functions";
import { fileExtension } from "./listing-image-url";

const BACKEND_URL = import.meta.env.VITE_SUPABASE_URL as string;
export type UploadJob = { id: string; name: string; error: string | null };

export function useListingImageUpload(
  listingId: string | null,
  ensureListingId: () => Promise<string>,
  refresh: () => void,
) {
  const [busy, setBusy] = useState(false);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const files = useRef(new Map<string, File>());

  async function processOne(id: string, imageId: string, file: File) {
    const processed = await processImageFile(file);
    const variants: VariantsJson = {};
    for (const variant of processed.variants) {
      const path = variantPath(id, imageId, variant.key);
      const { error } = await supabase.storage.from(IMAGES_BUCKET)
        .upload(path, variant.blob, { contentType: "image/webp", upsert: true });
      if (error) throw new Error(error.message);
      variants[variant.key] = {
        path,
        url: publicImageUrl(BACKEND_URL, path),
        width: variant.width,
        height: variant.height,
        bytes: variant.blob.size,
      };
    }
    const contentType = file.type || "image/jpeg";
    const original = originalPath(id, imageId, fileExtension(file.name, contentType));
    const { error } = await supabase.storage.from(ORIGINALS_BUCKET)
      .upload(original, file, { contentType, upsert: true });
    if (error) throw new Error(error.message);
    await recordListingImage({ data: {
      listingId: id,
      imageId,
      originalStoragePath: original,
      contentType,
      originalSizeBytes: file.size,
      filename: file.name.slice(0, 255),
      variants,
      width: processed.width,
      height: processed.height,
      blurhash: processed.blurhash,
    } });
  }

  async function runJob(id: string, jobId: string, file: File) {
    files.current.set(jobId, file);
    setJobs((old) => [...old.filter((job) => job.id !== jobId), { id: jobId, name: file.name, error: null }]);
    try {
      await processOne(id, jobId, file);
      files.current.delete(jobId);
      setJobs((old) => old.filter((job) => job.id !== jobId));
      refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setJobs((old) => old.map((job) => job.id === jobId ? { ...job, error: message } : job));
    }
  }

  async function upload(input: FileList | File[]) {
    setBusy(true);
    try {
      const id = listingId ?? await ensureListingId();
      for (const file of Array.from(input)) await runJob(id, crypto.randomUUID(), file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  return { busy, setBusy, jobs, setJobs, files, runJob, upload };
}