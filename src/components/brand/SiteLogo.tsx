import { BrandMark } from "@/components/brand/BrandMark";
import { logoSrc } from "@/lib/theme/logo";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  settings: SiteSettings;
  /** `light` is for use over hero photography. */
  tone?: "dark" | "light";
  className?: string;
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
 * Renders one canonical uploaded logo at one shared size throughout public,
 * auth and admin chrome. Backgrounds may differ; the logo file never does.
 */
export function SiteLogo({
  settings,
  tone = "dark",
  className,
  interactive = false,
}: Props) {
  const src = logoSrc("original", settings.logo_url);
  const scale = Math.min(140, Math.max(60, settings.logo_size ?? 100)) / 100;
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
        "h-16 w-auto max-w-full object-contain",
        interactive && INTERACTIVE_CLASS,
        className,
      )}
      style={{ transform: `scale(${scale})` }}
      loading="eager"
      decoding="async"
    />
  );
}
