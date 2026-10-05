// Position of a listing on the German energy label scale (GEG Anlage 10).
// The scale and its kWh/(m²·a) thresholds are legal facts, so they live in
// core; the component only draws the segments and the marker it is given.
import { energyClassOf } from "./energy-class";

export const DE_SCALE = ["A+", "A", "B", "C", "D", "E", "F", "G", "H"] as const;
/** Upper bound of each class except H, in kWh/(m²·a). */
const DE_LIMITS = [30, 50, 75, 100, 130, 160, 200, 250] as const;
/** Visual width given to the open-ended H segment. */
const H_SPAN = 50;

export type EnergyScale = {
  classes: readonly string[];
  ticks: string[];
  /** Marker position in percent of the scale width, or null when unknown. */
  markerPercent: number | null;
  /** Marker label: the formatted reading, or the class letter. */
  markerLabel: string | null;
};

function classIndexForValue(value: number): number {
  const index = DE_LIMITS.findIndex((limit) => value < limit);
  return index === -1 ? DE_LIMITS.length : index;
}

function percentForValue(value: number): number {
  const index = classIndexForValue(value);
  const lower = index === 0 ? 0 : DE_LIMITS[index - 1];
  const upper = index < DE_LIMITS.length ? DE_LIMITS[index] : lower + H_SPAN;
  const fraction = Math.min(Math.max((value - lower) / (upper - lower), 0), 0.98);
  return ((index + fraction) / DE_SCALE.length) * 100;
}

/**
 * The scale is only drawn for Germany: Austria and Switzerland use other
 * scales, and drawing the German one there would misstate the certificate.
 */
export function energyScale(input: {
  country: string;
  energy: unknown;
  formattedValue: string | null;
}): EnergyScale | null {
  if ((input.country || "").toUpperCase() !== "DE") return null;
  const e = (input.energy && typeof input.energy === "object" ? input.energy : {}) as Record<
    string,
    unknown
  >;
  const raw = e["final_energy"];
  const value = typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : null;
  const cls = energyClassOf(e);
  const classIndex = cls ? DE_SCALE.indexOf(cls === "A++" ? "A+" : (cls as never)) : -1;

  let markerPercent: number | null = null;
  let markerLabel: string | null = null;
  if (value != null) {
    markerPercent = percentForValue(value);
    markerLabel = input.formattedValue;
  } else if (classIndex >= 0) {
    markerPercent = ((classIndex + 0.5) / DE_SCALE.length) * 100;
    markerLabel = DE_SCALE[classIndex];
  }
  if (markerPercent == null && classIndex < 0) return null;

  return {
    classes: DE_SCALE,
    ticks: [...DE_LIMITS.map((l) => `<${l}`), `>${DE_LIMITS[DE_LIMITS.length - 1]}`],
    markerPercent,
    markerLabel,
  };
}
