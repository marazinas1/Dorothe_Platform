import { useSuspenseQuery } from "@tanstack/react-query";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import type { Locale } from "@/i18n/config";

/**
 * Locale for links from admin/auth into the public site. Admin URLs carry no
 * language, so public links use the site's default locale.
 */
export function usePublicLocale(): Locale {
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  return settings.default_locale as Locale;
}
