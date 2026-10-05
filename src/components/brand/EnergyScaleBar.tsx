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
          <div
            className="absolute -top-[34px] flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-[13px] font-bold tabular-figures text-foreground"
            style={{ left: `${scale.markerPercent}%` }}
          >
            {scale.markerLabel}
            <span aria-hidden className="mt-[3px] h-2.5 w-0.5 bg-foreground" />
          </div>
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
