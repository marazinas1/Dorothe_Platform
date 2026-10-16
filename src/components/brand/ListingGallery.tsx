import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { pickImageUrl } from "@/lib/listings/image";
import { pickLocalized } from "@/lib/listings/format";
import { splitListingImages, type GalleryImage } from "@/lib/listings/gallery-images";
import { Button } from "@/components/brand/ui/Button";
import { buttonClass } from "@/components/brand/ui/Button";
import { ListingIcon } from "@/components/brand/ui/ListingIcon";
import { ImageViewer } from "./ImageViewer";

type Props = {
  images: GalleryImage[];
  locale: Locale;
  title: string;
  tourUrl?: string | null;
};

/** Beyond this many images above the fold, the browser decides when to load. */
const EAGER = 3;

/**
 * Detail-page gallery: photographs only — plans and renderings are shown as
 * documents further down. Clicking opens the shared full-screen viewer.
 */
export function ListingGallery({ images, locale, title, tourUrl = null }: Props) {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { photos } = splitListingImages(images);
  const list = photos.filter((i) => pickImageUrl(i.variants, "detail"));

  if (list.length === 0) {
    return <div className="aspect-[16/9] w-full rounded-media bg-muted" />;
  }

  const visible = list.slice(0, 5);
  const n = visible.length;

  // The mosaic adapts to how many photos exist, so it never leaves an empty tile.
  const tile = (i: number) => {
    if (i === 0) {
      if (n === 1) return "aspect-[4/3] md:col-span-4 md:row-span-2 md:aspect-auto md:min-h-[500px]";
      return "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[500px]";
    }
    const base = "hidden min-h-[246px] md:block";
    if (n === 2) return `${base} md:col-span-2 md:row-span-2`;
    if (n === 3) return `${base} md:col-span-2`;
    if (n === 4 && i === 1) return `${base} md:col-span-2`;
    return base;
  };

  return (
    <>
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
        {visible.map((img, i) => (
          <button
            key={img.id ?? i}
            type="button"
            onClick={() => setOpenIdx(i)}
            aria-label={i === 0 ? t("listings.detail.gallery_open") : undefined}
            className={`${buttonClass({ variant: "ghost", className: "group relative h-auto min-h-11 overflow-hidden rounded-media bg-muted p-0" })} ${tile(i)}`}
          >
            <img
              src={pickImageUrl(img.variants, "detail") ?? ""}
              alt={pickLocalized(img.alt_text, locale) || title}
              loading={i < EAGER ? undefined : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
        {tourUrl ? (
          <a href={tourUrl} target="_blank" rel="noopener noreferrer" className={buttonClass({ variant: "secondary", size: "sm" })}>
            <ListingIcon name="map" /> {t("listings.detail.tour")}
          </a>
        ) : null}
        <Button type="button" variant="ghost" size="sm" onClick={() => navigator.share?.({ title, url: window.location.href })}>
          <ListingIcon name="share" /> {t("listings.detail.share")}
        </Button>
      </div>

      <ImageViewer
        items={list.map((img) => ({
          src: pickImageUrl(img.variants, "detail") ?? "",
          alt: pickLocalized(img.alt_text, locale) || title,
        }))}
        index={openIdx}
        onChange={setOpenIdx}
      />
    </>
  );
}
