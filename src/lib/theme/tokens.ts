/**
 * Design token engine (core) — PUBLIC SITE ONLY.
 *
 * Everything a clone may change — surface and text colours, accent, fonts,
 * corner radii, button shape — is a value in site_settings and is emitted here
 * as CSS custom properties on :root. Nothing about a client's look lives in
 * CSS or in components.
 *
 * The admin is the platform's second design system and deliberately ignores
 * these values: `.admin-theme` in src/styles.css defines a fixed admin look
 * that is identical in every clone.
 */


import type { SiteSettings } from "@/types/site-settings";

/** Corner radius scale keys stored in site_settings.radius_scale. */
export const RADIUS_SCALES = {
  sharp: { base: "0.125rem", media: "0.25rem" },
  /** 4px everywhere: precise without reading playful. */
  precise: { base: "0.25rem", media: "0.25rem" },
  soft: { base: "0.5rem", media: "0.875rem" },
  rounded: { base: "0.875rem", media: "1.25rem" },
} as const;

export type RadiusScaleKey = keyof typeof RADIUS_SCALES;

/** Button shape keys stored in site_settings.button_style. */
export const BUTTON_STYLES = {
  square: "0.125rem",
  rounded: "var(--radius)",
  pill: "9999px",
} as const;

export type ButtonStyleKey = keyof typeof BUTTON_STYLES;

export const DEFAULT_RADIUS_SCALE: RadiusScaleKey = "soft";
export const DEFAULT_BUTTON_STYLE: ButtonStyleKey = "rounded";

export function radiusScaleKey(value: string | null | undefined): RadiusScaleKey {
  return value && value in RADIUS_SCALES ? (value as RadiusScaleKey) : DEFAULT_RADIUS_SCALE;
}

export function buttonStyleKey(value: string | null | undefined): ButtonStyleKey {
  return value && value in BUTTON_STYLES ? (value as ButtonStyleKey) : DEFAULT_BUTTON_STYLE;
}

type Rule = [string, string | null | undefined];

/**
 * Builds the `:root { … }` declaration list from site_settings.
 *
 * Deerva rule: a client brand overrides only `--primary` (and the ring tones
 * derived from it) plus the logo. Surfaces, text, fonts and radii belong to
 * the theme family in src/styles.css; the matching site_settings fields are
 * kept for compatibility but no longer emitted.
 */
export function buildThemeVariables(settings: SiteSettings): string {
  const primary = settings.primary_color;
  const rules: Rule[] = [
    ["--primary", primary],
    ["--ring", primary],
    ["--sidebar-primary", primary],
    ["--sidebar-ring", primary],
  ];

  return rules
    .filter(([, value]) => Boolean(value))
    .map(([name, value]) => `${name}: ${value};`)
    .join("");
}
