/**
 * Energy certificate helpers. Germany's GEG requires the efficiency class to be
 * shown in any listing advertisement, so it is part of the card, not a detail.
 * The class lives in the `energy` jsonb column (see validate_listing_energy).
 */
const CLASSES = ["A++", "A+", "A", "B", "C", "D", "E", "F", "G", "H"] as const;

export function energyClassOf(energy: unknown): string | null {
  if (!energy || typeof energy !== "object") return null;
  const value = (energy as Record<string, unknown>).efficiency_class;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return (CLASSES as readonly string[]).includes(normalized) ? normalized : null;
}

/** Filled label chip in the official energy-scale colour (tokens in styles.css). */
const TONES: Record<string, string> = {
  "A++": "bg-energy-ap text-on-media",
  "A+": "bg-energy-ap text-on-media",
  A: "bg-energy-a text-on-media",
  B: "bg-energy-b text-on-media",
  C: "bg-energy-c text-foreground",
  D: "bg-energy-d text-foreground",
  E: "bg-energy-e text-foreground",
  F: "bg-energy-f text-on-media",
  G: "bg-energy-g text-on-media",
  H: "bg-energy-h text-on-media",
};

export function energyClassTone(cls: string): string {
  return TONES[cls] ?? "bg-card text-foreground";
}
