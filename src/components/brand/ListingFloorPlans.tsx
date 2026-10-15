import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { pickImageUrl } from "@/lib/listings/image";
import { pickLocalized } from "@/lib/listings/format";
import { splitListingImages, type GalleryImage } from "@/lib/listings/gallery-images";
import type { PublicFloorPlan } from "@/lib/listings/queries.functions";

type Props = {
  images: GalleryImage[];
  /** Plans uploaded as files in the admin documents section. */
  plans?: PublicFloorPlan[];
  locale: Locale;
};

/**
 * Floor plans and renderings, out of the photo gallery. A rendering is labelled
 * as one so nobody mistakes a visualisation for a photograph of what exists.
 */
export function ListingFloorPlans({ images, plans = [], locale }: Props) {
  const { t } = useTranslation();
  const { floorplans, visualizations } = splitListingImages(images);
  const items = [
    ...floorplans.map((i) => ({ img: i, kind: "floorplan" as const })),
    ...visualizations.map((i) => ({ img: i, kind: "visualization" as const })),
  ].filter((i) => pickImageUrl(i.img.variants, "detail"));

  if (items.length === 0 && plans.length === 0) return null;
  const numbered = plans.length > 1;

  return (
    <div id="floor-plans" className="scroll-mt-28">
      <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
        {t("listings.detail.sections.plans")}
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {plans.map((plan, i) => {
          const label = `${t("listings.detail.floorplan")}${numbered ? ` ${i + 1}` : ""}`;
          return (
            <figure key={plan.id}>
              <a
                href={plan.url}
                target="_blank"
                rel="noreferrer"
                className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-media border border-border bg-background"
              >
                {plan.isPdf ? (
                  <span className="text-sm font-medium underline underline-offset-4">
                    {t("listings.detail.document_open")} (PDF)
                  </span>
                ) : (
                  <img src={plan.url} alt={label} loading="lazy" decoding="async" className="h-full w-full object-contain p-3" />
                )}
              </a>
              <figcaption className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</figcaption>
            </figure>
          );
        })}
        {items.map(({ img, kind }, i) => (
          <figure key={img.id ?? i}>
            <a
              href={pickImageUrl(img.variants, "detail") ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-media border border-border bg-background"
            >
              <img
                src={pickImageUrl(img.variants, "detail") ?? ""}
                alt={pickLocalized(img.alt_text, locale) || t(`listings.detail.${kind}`)}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-contain p-3"
              />
            </a>
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {pickLocalized(img.caption, locale) || t(`listings.detail.${kind}`)}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
