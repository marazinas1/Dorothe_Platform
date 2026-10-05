import { energyClassTone } from "@/lib/listings/energy-class";
import type { EnergyScale } from "@/lib/listings/energy-scale";

/** The coloured A+–H label scale with the listing's reading marked above it. */
export function EnergyScaleBar({ scale, label }: { scale: EnergyScale; label: string }) {
  return (
    <div role="img" aria-label={label}>
      <div className="relative mt-10 grid grid-cols-9 gap-0.5">
        {scale.classes.map((cls) => (
          <span
            key={cls}
            className={`grid h-[34px] place-items-center text-[12.5px] font-bold ${energyClassTone(cls)}`}
          >
            {cls}
          </span>
        ))}
        {scale.markerPercent != null && scale.markerLabel ? (
          <>
            {/* Near either end the label shifts inward so it never leaves the card. */}
            <span
              className="absolute -top-[34px] whitespace-nowrap text-[13px] font-bold tabular-figures text-foreground"
              style={{
                left: `${scale.markerPercent}%`,
                transform: `translateX(-${scale.markerPercent > 85 ? 90 : scale.markerPercent < 15 ? 10 : 50}%)`,
              }}
            >
              {scale.markerLabel}
            </span>
            <span
              aria-hidden
              className="absolute -top-3 h-2.5 w-0.5 -translate-x-1/2 bg-foreground"
              style={{ left: `${scale.markerPercent}%` }}
            />
          </>
        ) : null}
      </div>
      <div className="mt-2 grid grid-cols-9 text-center text-[11.5px] tabular-figures text-muted-foreground">
        {scale.ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
}
