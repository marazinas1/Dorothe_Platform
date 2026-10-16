import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/brand/ui/Button";

export type ViewerItem = { src: string; alt: string };

type Props = {
  items: ViewerItem[];
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Full-screen, keyboard-driven viewer shared by photos and floor plans. */
export function ImageViewer({ items, index, onChange }: Props) {
  const { t } = useTranslation();
  const n = items.length;
  const step = (d: number) => onChange(index == null ? index : (index + d + n) % n);

  useEffect(() => {
    if (index == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") onChange((index + 1) % n);
      if (e.key === "ArrowLeft") onChange((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onChange]);

  if (index == null || !items[index]) return null;
  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={() => onChange(null)}
    >
      <img src={item.src} alt={item.alt} className="max-h-full max-w-full rounded-media object-contain" />
      {n > 1 ? (
        <div
          className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <ViewerButton label={t("listings.detail.gallery_prev")} onClick={() => step(-1)}>‹</ViewerButton>
          <span className="tabular-figures text-sm text-background/80">
            {index + 1} / {n}
          </span>
          <ViewerButton label={t("listings.detail.gallery_next")} onClick={() => step(1)}>›</ViewerButton>
        </div>
      ) : null}
      <ViewerButton
        label={t("listings.detail.gallery_close")}
        className="absolute right-4 top-4"
        onClick={(e) => {
          e.stopPropagation();
          onChange(null);
        }}
      >
        ×
      </ViewerButton>
    </div>
  );
}

function ViewerButton({ label, children, onClick, className = "" }: {
  label: string;
  children: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <Button type="button" aria-label={label} onClick={onClick} variant="ghost" size="icon" inverse className={`text-xl ${className}`}>
      {children}
    </Button>
  );
}
