import logoOriginal from "@/assets/brand/logo.png.asset.json";
import logoMono from "@/assets/brand/logo-mono.png.asset.json";

export type LogoVariant = "mono" | "original";

/**
 * Bundled fallback marks, used only until a client uploads their own logo.
 * The logo configured in site_settings always wins, so changing it in the
 * admin changes the public site, the admin panel and the sign-in screen.
 */
const FILES: Record<LogoVariant, string> = {
  original: logoOriginal.url,
  mono: logoMono.url,
};

export function logoSrc(variant: LogoVariant, configured: string | null): string | null {
  return configured ?? FILES[variant] ?? null;
}
