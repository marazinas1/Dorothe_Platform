import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { listingsToPoints } from "@/lib/maps/carto";
import type { PublicListing } from "@/lib/listings/queries.functions";
import { pickLocalized } from "@/lib/listings/format";
import { MapConsentGate } from "@/components/brand/MapConsentGate";

const MapCanvas = lazy(() => import("@/components/brand/MapCanvas"));

type Props = {
  listing: PublicListing;
  locale: Locale;
};

/** Same height as the map, so loading it moves nothing on the page. */
const CANVAS = "aspect-[16/9] w-full";

function Skeleton() {
  return <div className={`${CANVAS} bg-muted`} />;
}

/**
 * Location block. The map loads only through MapConsentGate, because the
 * tiles come from a third party that receives the visitor's IP address.
 * geo_precision still decides whether there is a map at all.
 */
export function ListingLocationMap({ listing, locale }: Props) {
  const { t } = useTranslation();
  const points = listingsToPoints([listing], locale);
  const townLine = [listing.address_zip, listing.address_city].filter(Boolean).join(" ");
  // content_sections is an array of { key, items: { [locale]: string[] } }.
  const section = Array.isArray(listing.content_sections)
    ? (listing.content_sections as any[]).find((s) => s?.key === "surroundings")
    : (listing.content_sections as any)?.surroundings;
  const items = section?.items ?? section;
  const localized = items?.[locale] ?? items?.de ?? items?.en;
  const surroundings = Array.isArray(localized)
    ? localized.filter((v) => typeof v === "string").join("\n\n")
    : pickLocalized(items, locale);

  return (
    <div>
      <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
        {t("listings.detail.location")}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {points.length === 0
          ? t("listings.detail.location_hidden")
          : points[0]!.precision === "approximate"
            ? t("listings.detail.location_approximate")
            : townLine}
      </p>

      {surroundings ? (
        <div className="mt-8 max-w-2xl space-y-5 text-base leading-[1.75] text-foreground/90">
          {surroundings
            .split(/\n\s*\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </div>
      ) : null}

      {points.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-media border border-border">
          <MapConsentGate className={CANVAS}>
            <ClientOnly fallback={<Skeleton />}>
              <Suspense fallback={<Skeleton />}>
                <MapCanvas
                  points={points}
                  zoom={points[0]!.precision === "approximate" ? 12 : 15}
                  className={CANVAS}
                />
              </Suspense>
            </ClientOnly>
          </MapConsentGate>
        </div>
      ) : townLine ? (
        <div className="mt-6 text-base">{townLine}</div>
      ) : null}
    </div>
  );
}
