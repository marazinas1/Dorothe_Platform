import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";

const PinMapCanvas = lazy(() => import("@/components/admin/listings/PinMapCanvas"));

/** Germany-wide view, used until the office has coordinates. */
const FALLBACK = { lat: 51.16, lng: 10.45 };

function Skeleton() {
  return <div className="aspect-[16/9] w-full bg-muted" />;
}

/**
 * Visual picker for the office point in Settings. Same draggable-pin map as the
 * listing form, so both places behave identically.
 */
export function OfficePinField({
  lat,
  lng,
  onMove,
}: {
  lat: string;
  lng: string;
  onMove: (lat: number, lng: number) => void;
}) {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const hasPoint =
    lat.trim() !== "" && lng.trim() !== "" && !Number.isNaN(parsedLat) && !Number.isNaN(parsedLng);

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border">
      <ClientOnly fallback={<Skeleton />}>
        <Suspense fallback={<Skeleton />}>
          <PinMapCanvas
            lat={hasPoint ? parsedLat : FALLBACK.lat}
            lng={hasPoint ? parsedLng : FALLBACK.lng}
            onMove={onMove}
          />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
