import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AdminErrorState({
  title,
  detail,
  retryLabel,
  onRetry,
}: {
  title: string;
  detail?: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius)] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        {detail ? <p className="mt-1 break-words">{detail}</p> : null}
      </div>
      {retryLabel && onRetry ? (
        <Button type="button" size="sm" variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}