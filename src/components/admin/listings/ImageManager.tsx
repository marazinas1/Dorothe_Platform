import { Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { deleteListingImage } from "@/lib/listings/media.functions";
import { FormSection } from "./FieldRow";
import { ImageCard, type ImageRecord } from "./ImageCard";
import { usePhotoReorder } from "@/lib/listings/use-photo-reorder";
import { useImageOrder } from "./use-image-order";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { UploadJobs } from "./UploadJobs";
import { useListingImageUpload } from "./use-listing-image-upload";

export function ImageManager({
  listingId,
  images,
  refresh,
  ensureListingId,
}: {
  listingId: string | null;
  images: ImageRecord[];
  refresh: () => void;
  /** Creates the draft row on demand; uploads wait for it before attaching. */
  ensureListingId: () => Promise<string>;
}) {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ImageRecord | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useListingImageUpload(listingId, ensureListingId, refresh);

  // Order is held locally while arranging and persisted with a debounce, so a
  // refresh arriving mid-save cannot snap the tiles back.
  const { ordered, move, moveTo, makeCover, savingOrder } = useImageOrder({
    listingId,
    images,
    refresh,
    onError: (message) => toast.error(message),
  });

  // The gesture only reports the final position; moveTo owns the reordering.
  const reorder = usePhotoReorder({ onDrop: moveTo });

  async function remove(image: ImageRecord) {
    upload.setBusy(true);
    try {
      await deleteListingImage({ data: { imageId: image.id } });
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      upload.setBusy(false);
    }
  }


  return (
    <FormSection icon={ImageIcon}
      anchor="photos"
      title={t("admin.listings.sections.images")}
      description={t("admin.listings.images.uploadHint")}
    >
      {/* The technical detail is demoted: brokers need one line, not a paragraph. */}
      <details className="mb-4 text-xs text-muted-foreground">
        <summary className="cursor-pointer">{t("admin.listings.images.technicalTitle")}</summary>
        <p className="mt-1 leading-relaxed">{t("admin.listings.images.technicalNote")}</p>
      </details>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void upload.upload(e.target.files);
          e.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="outline"
        disabled={upload.busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) void upload.upload(e.dataTransfer.files);
        }}
        className={`flex h-auto w-full flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
        } disabled:cursor-progress`}
      >
        {upload.busy ? (
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-7 w-7 text-muted-foreground" />
        )}
        <span className="mt-2 font-heading text-base text-foreground">
          {t("admin.listings.images.dropzoneTitle")}
        </span>
        <span className="text-xs text-muted-foreground">
          {t("admin.listings.images.dropzoneMeta")}
        </span>
      </Button>



      <UploadJobs
        jobs={upload.jobs}
        listingId={listingId}
        retry={upload.runJob}
        fileFor={(jobId) => upload.files.current.get(jobId)}
        dismiss={(jobId) => {
          upload.files.current.delete(jobId);
          upload.setJobs((old) => old.filter((job) => job.id !== jobId));
        }}
      />

      {ordered.length > 0 ? (
        <>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("admin.listings.images.coverHint")}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {ordered.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                total={ordered.length}
                busy={upload.busy}
                savingOrder={savingOrder}
                dragging={reorder.dragging}
                isDragged={reorder.fromIndex === index}
                isTarget={reorder.dragging && reorder.overIndex === index && reorder.fromIndex !== index}
                onPointerDown={reorder.start}
                onMove={move}
                onMakeCover={makeCover}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        </>
      ) : upload.jobs.length === 0 ? (
        <div className="mt-3 rounded-[var(--radius)] border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
          {t("admin.listings.images.empty")}
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => (open ? null : setPendingDelete(null))}
        title={t("admin.listings.images.deleteTitle")}
        description={t("admin.listings.images.deleteBody")}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await remove(pendingDelete);
        }}
      />

    </FormSection>
  );
}
