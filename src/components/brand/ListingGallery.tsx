import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { pickImageUrl } from "@/lib/listings/image";
import { pickLocalized } from "@/lib/listings/format";
import { splitListingImages, type GalleryImage } from "@/lib/listings/gallery-images";
import { Button } from "@/components/brand/ui/Button";
import { ListingIcon } from "@/components/brand/ui/ListingIcon";

type Props = {
  images: GalleryImage[];
  locale: Locale;
  title: string;
  hasTour?: boolean;
};

/** Beyond this many images above the fold, the browser decides when to load. */
const EAGER = 3;

/**
 * Detail-page gallery: photographs only — plans and renderings are shown as
 * documents further down. Every image is server-rendered so the page is
 * complete without JavaScript; the browser lazy-loads everything below the
 * first few. Clicking opens a keyboard-driven full-screen viewer.
 */
export function ListingGallery({ images, locale, title, hasTour = false }: Props) {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { photos } = splitListingImages(images);
  const list = photos.filter((i) => pickImageUrl(i.variants, "detail"));

  useEffect(() => {
    if (openIdx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i == null ? i : (i + 1) % list.length));
      if (e.key === "ArrowLeft")
        setOpenIdx((i) => (i == null ? i : (i - 1 + list.length) % list.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, list.length]);

  if (list.length === 0) {
    return <div className="aspect-[16/9] w-full rounded-media bg-muted" />;
  }

  const visible = list.slice(0, 5);

  return (
    <>
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
        {visible.map((img, i) => (
          <button
            key={img.id ?? i}
            type="button"
            onClick={() => setOpenIdx(i)}
            aria-label={i === 0 ? t("listings.detail.gallery_open") : undefined}
            className={`group relative overflow-hidden rounded-media bg-muted ${
              i === 0
                ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[500px]"
                : "hidden min-h-[246px] md:block"
            }`}
          >
            <img
              src={pickImageUrl(img.variants, "detail") ?? ""}
              alt={pickLocalized(img.alt_text, locale) || title}
              loading={i < EAGER ? undefined : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            {i === visible.length - 1 && list.length > visible.length ? (
              <span className="absolute right-4 bottom-4 rounded-[var(--radius-button)] bg-scrim px-3 py-2 text-xs font-semibold text-on-media">
                {list.length} {t("listings.detail.gallery_open")}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpenIdx(0)}>
          <ListingIcon name="cam" /> {t("listings.detail.all_photos")}
        </Button>
        {splitListingImages(images).floorplans.length > 0 ? (
          <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById("floor-plans")?.scrollIntoView({ behavior: "smooth" })}>
            <ListingIcon name="plan" /> {t("listings.detail.floorplan")}
          </Button>
        ) : null}
        {hasTour ? (
          <Button type="button" variant="secondary" size="sm">
            <ListingIcon name="map" /> {t("listings.detail.tour")}
          </Button>
        ) : null}
        <Button type="button" variant="ghost" size="sm" onClick={() => navigator.share?.({ title, url: window.location.href })}>
          <ListingIcon name="share" /> {t("listings.detail.share")}
        </Button>
      </div>

      {openIdx != null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIdx(null)}
        >
          <img
            src={pickImageUrl(list[openIdx]!.variants, "detail") ?? ""}
            alt={pickLocalized(list[openIdx]!.alt_text, locale) || title}
            className="max-h-full max-w-full rounded-media object-contain"
          />
          <div
            className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ViewerButton
              label={t("listings.detail.gallery_prev")}
              onClick={() => setOpenIdx((i) => (i == null ? i : (i - 1 + list.length) % list.length))}
            >
              ‹
            </ViewerButton>
            <span className="tabular-figures text-sm text-background/80">
              {openIdx + 1} / {list.length}
            </span>
            <ViewerButton
              label={t("listings.detail.gallery_next")}
              onClick={() => setOpenIdx((i) => (i == null ? i : (i + 1) % list.length))}
            >
              ›
            </ViewerButton>
          </div>
          <ViewerButton
            label={t("listings.detail.gallery_close")}
            className="absolute right-4 top-4"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(null);
            }}
          >
            ×
          </ViewerButton>
        </div>
      ) : null}
    </>
  );
}

function ViewerButton({
  label,
  children,
  onClick,
  className = "",
}: {
  label: string;
  children: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      aria-label={label}
      onClick={onClick}
      variant="ghost" size="icon" inverse className={`text-xl ${className}`}
    >
      {children}
    </Button>
  );
}
