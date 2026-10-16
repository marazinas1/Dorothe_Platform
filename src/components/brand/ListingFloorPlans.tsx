import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { pickImageUrl } from "@/lib/listings/image";
import { pickLocalized } from "@/lib/listings/format";
import { splitListingImages, type GalleryImage } from "@/lib/listings/gallery-images";
import type { PublicFloorPlan } from "@/lib/listings/queries.functions";
import { floorLevelText } from "@/lib/listings/floor-levels";
import { ImageViewer, type ViewerItem } from "./ImageViewer";

type Props = {
  images: GalleryImage[];
  /** Plans uploaded as files in the admin documents section. */
  plans?: PublicFloorPlan[];
  locale: Locale;
};

type Tile = { key: string; label: string; src: string; isPdf: boolean };

const caption = "mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground";
const frame =
  "flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-media border border-border bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Floor plans and renderings, out of the photo gallery. Image plans open in the
 * same full-screen viewer as photos, so several floors can be paged through;
 * PDFs open in the browser's own viewer.
 */
export function ListingFloorPlans({ images, plans = [], locale }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);
  const { floorplans, visualizations } = splitListingImages(images);
  const numbered = plans.length > 1;

  const tiles: Tile[] = [
    ...plans.map((p, i) => ({
      key: p.id,
      label: floorLevelText(p.label, t) ?? `${t("listings.detail.floorplan")}${numbered ? ` ${i + 1}` : ""}`,
      src: p.url,
      isPdf: p.isPdf,
    })),
    ...[
      ...floorplans.map((img) => ({ img, kind: "floorplan" as const })),
      ...visualizations.map((img) => ({ img, kind: "visualization" as const })),
    ]
      .filter(({ img }) => pickImageUrl(img.variants, "detail"))
      .map(({ img, kind }, i) => ({
        key: img.id ?? `img-${i}`,
        label: pickLocalized(img.caption, locale) || pickLocalized(img.alt_text, locale) || t(`listings.detail.${kind}`),
        src: pickImageUrl(img.variants, "detail") ?? "",
        isPdf: false,
      })),
  ];
  if (tiles.length === 0) return null;

  const viewable = tiles.filter((x) => !x.isPdf);
  const viewerItems: ViewerItem[] = viewable.map((x) => ({ src: x.src, alt: x.label }));

  return (
    <div id="floor-plans" className="scroll-mt-28">
      <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">{t("listings.detail.sections.plans")}</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {tiles.map((tile) => (
          <figure key={tile.key}>
            {tile.isPdf ? (
              <a href={tile.src} target="_blank" rel="noreferrer" className={frame.replace("cursor-zoom-in", "cursor-pointer")}>
                <span className="text-sm font-medium underline underline-offset-4">
                  {t("listings.detail.document_open")} (PDF)
                </span>
              </a>
            ) : (
              <button type="button" className={frame} aria-label={tile.label}
                onClick={() => setOpen(viewable.indexOf(tile))}>
                <img src={tile.src} alt={tile.label} loading="lazy" decoding="async" className="h-full w-full object-contain p-3" />
              </button>
            )}
            <figcaption className={caption}>{tile.label}</figcaption>
          </figure>
        ))}
      </div>
      <ImageViewer items={viewerItems} index={open} onChange={setOpen} />
    </div>
  );
}
