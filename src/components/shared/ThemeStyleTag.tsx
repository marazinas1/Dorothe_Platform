import { buildThemeVariables } from "@/lib/theme/tokens";
import type { SiteSettings } from "@/types/site-settings";

/**
 * Emits a <style>:root { … }</style> block with the client's design tokens from
 * site_settings. These variables drive the PUBLIC site only; the admin has its
 * own fixed design system (`.admin-theme`) that outranks them. Rendered inside
 * <body> during SSR; :root custom properties apply globally regardless of tag
 * placement.
 */

export function ThemeStyleTag({ settings }: { settings: SiteSettings }) {
  const declarations = buildThemeVariables(settings);
  if (!declarations) return null;
  return (
    <style
      data-theme-overrides
      dangerouslySetInnerHTML={{ __html: `:root{${declarations}}` }}
    />
  );
}
