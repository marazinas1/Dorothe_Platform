import { Loader2, RotateCcw, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type { UploadJob } from "./use-listing-image-upload";

type Props = {
  jobs: UploadJob[];
  listingId: string | null;
  retry: (id: string, jobId: string, file: File) => Promise<void>;
  fileFor: (jobId: string) => File | undefined;
  dismiss: (jobId: string) => void;
};

export function UploadJobs({ jobs, listingId, retry, fileFor, dismiss }: Props) {
  const { t } = useTranslation();
  if (jobs.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2">
      {jobs.map((job) => (
        <li key={job.id} className="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card px-3 py-2 text-sm">
          {job.error ? null : <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
          <span className="truncate">{job.name}</span>
          <span className={`truncate text-xs ${job.error ? "text-destructive" : "text-muted-foreground"}`}>
            {job.error ?? t("admin.listings.images.status.processing")}
          </span>
          {job.error ? (
            <div className="ml-auto flex items-center gap-1">
              <Button type="button" size="sm" variant="outline" onClick={() => {
                const file = fileFor(job.id);
                if (file && listingId) void retry(listingId, job.id, file);
              }}>
                <RotateCcw className="h-3.5 w-3.5" />{t("admin.listings.images.retry")}
              </Button>
              <Button type="button" size="icon" variant="ghost" aria-label={t("admin.listings.images.dismiss")} onClick={() => dismiss(job.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}