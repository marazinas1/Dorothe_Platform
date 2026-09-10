import { lazy, Suspense, useMemo } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { MapPoint } from "@/lib/maps/carto";
import type { SiteSettings } from "@/types/site-settings";

const MapCanvas = lazy(() => import("@/components/brand/MapCanvas"));

const CANVAS = "aspect-[16/9] w-full";

function Skeleton() {
  return <div className={`${CANVAS} bg-muted`} />;
}

/**
 * Where the office is. The point comes straight from site settings, so moving
 * the pin in the admin moves it here — no coordinates live in this file.
 */
export function OfficeMap({ settings }: { settings: SiteSettings }) {
  const { t } = useTranslation();
  const lat = settings.geo_lat == null ? null : Number(settings.geo_lat);
  const lng = settings.geo_lng == null ? null : Number(settings.geo_lng);

  const points = useMemo<MapPoint[]>(
    () =>
      lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)
        ? []
        : [{ id: "office", lat, lng, precision: "exact", title: settings.site_name }],
    [lat, lng, settings.site_name],
  );

  if (points.length === 0) {
    return (
      <div
        className={`${CANVAS} flex items-center justify-center border border-border bg-muted p-8 text-center text-sm text-muted-foreground`}
      >
        {t("pages.contact.map_missing")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border">
      <ClientOnly fallback={<Skeleton />}>
        <Suspense fallback={<Skeleton />}>
          <MapCanvas
            points={points}
            zoom={15}
            className={CANVAS}
            resetLabel={t("pages.contact.map_reset")}
          />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
