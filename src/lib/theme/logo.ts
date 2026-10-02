export type LogoVariant = "mono" | "original";

/**
 * Returns the logo uploaded in Settings -> Brand assets, or null. No client
 * mark is bundled in code: without an upload the UI renders the neutral
 * typographic mark (site name) instead. `variant` is kept for API stability.
 */
export function logoSrc(_variant: LogoVariant, configured: string | null): string | null {
  return configured ?? null;
}
