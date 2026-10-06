import type { CSSProperties } from "react";

import { BrandMark } from "@/components/brand/BrandMark";
import { logoSrc } from "@/lib/theme/logo";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  settings: SiteSettings;
  /** `light` is for use over hero photography and dark chrome. */
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

/** The one shared height, scaled by the single size chosen in Site settings. */
const BASE_HEIGHT_REM = 4;
const MIN_LOGO_SIZE = 50;
const MAX_LOGO_SIZE = 150;

const clampSize = (value: number | null | undefined) =>
  Math.min(MAX_LOGO_SIZE, Math.max(MIN_LOGO_SIZE, Math.round(value ?? 100)));

/**
 * Renders the uploaded logo at one shared size throughout public, auth and
 * admin chrome. Over dark backgrounds the dark-background file is used when the
 * client uploaded one.
 */
export function SiteLogo({
  settings,
  tone = "dark",
  className,
  interactive = false,
}: Props) {
  const configured =
    tone === "light" ? (settings.logo_dark_url ?? settings.logo_url) : settings.logo_url;
  const src = logoSrc(tone === "light" ? "mono" : "original", configured);
  const height = `${(BASE_HEIGHT_REM * clampSize(settings.logo_size)) / 100}rem`;
  if (!src)
    return (
      <BrandMark
        settings={settings}
        tone={tone}
        className={cn(interactive && INTERACTIVE_CLASS, className)}
        style={{ fontSize: height } as CSSProperties}
      />
    );

  return (
    <img
      src={src}
      alt={settings.site_name}
      className={cn("w-auto max-w-full object-contain", interactive && INTERACTIVE_CLASS, className)}
      style={{ height } as CSSProperties}
      loading="eager"
      decoding="async"
    />
  );
}
