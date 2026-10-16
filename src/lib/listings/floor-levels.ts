// Floor plan levels: preset keys are translated per locale, anything else is
// the broker's own wording and shown as typed.
export const FLOOR_LEVELS = ["basement", "ground", "first", "second", "third", "attic", "site"] as const;
export type FloorLevel = (typeof FLOOR_LEVELS)[number];

export const isFloorLevel = (v: string | null | undefined): v is FloorLevel =>
  !!v && (FLOOR_LEVELS as readonly string[]).includes(v);

/** Display text for a stored label, or null when none is set. */
export function floorLevelText(label: string | null | undefined, t: (k: string) => string): string | null {
  const v = label?.trim();
  if (!v) return null;
  return isFloorLevel(v) ? t(`floorLevels.${v}`) : v;
}
