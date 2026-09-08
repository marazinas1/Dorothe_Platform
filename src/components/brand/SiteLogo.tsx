import { BrandMark } from "@/components/brand/BrandMark";
import { logoSrc, type LogoVariant } from "@/lib/theme/logo";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  settings: SiteSettings;
  /** `light` is for use over hero photography. */
  tone?: "dark" | "light";
  className?: string;
  /** Rendered height of the logo image. */
  size?: "sm" | "md";
  /**
   * `mono` is the one-colour header mark, `original` the supplied file. Both
   * come from src/assets/brand via @/lib/theme/logo.
   */
  variant?: LogoVariant;
  /**
   * `interactive` is for logos that act as the home button: hover darkens the
   * mark, mirroring the shared ActionButton fill -> darker-fill behaviour.
   * Applies to any client logo without code changes.
   */
  interactive?: boolean;
};

const INTERACTIVE_CLASS =
  "transition-[filter] duration-300 ease-out hover:brightness-[0.7]";

/**
 * Renders the brand mark, falling back to site_settings.logo_url and then to
 * the typographic BrandMark. A client that needs a light variant over
 * photography uploads it as logo_dark_url.
 */
export function SiteLogo({
  settings,
  tone = "dark",
  className,
  size = "md",
  variant = "original",
  interactive = false,
}: Props) {
  const fallback =
    tone === "light" ? (settings.logo_dark_url ?? settings.logo_url) : settings.logo_url;
  const src = tone === "light" ? fallback : logoSrc(variant, fallback);
  if (!src)
    return (
      <BrandMark
        settings={settings}
        tone={tone}
        className={cn(interactive && INTERACTIVE_CLASS, className)}
      />
    );

  return (
    <img
      src={src}
      alt={settings.site_name}
      className={cn(
        size === "sm" ? "h-12 md:h-14" : "h-16 md:h-20",
        "w-auto object-contain transition-[height] duration-500 ease-out",
        interactive && INTERACTIVE_CLASS,
        className,
      )}
      loading="eager"
      decoding="async"
    />
  );
}
