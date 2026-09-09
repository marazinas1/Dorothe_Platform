import { useSuspenseQuery } from "@tanstack/react-query";

import type { Locale } from "@/i18n/config";
import { copyVars } from "@/lib/config/site-copy";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";

import { pageContentQueryOptions } from "./queries.functions";
import { resolvePage } from "./resolve";
import type { ResolvedPage } from "./types";

/**
 * The words a public static page shows: the owner's own text where it exists,
 * the translated default everywhere else.
 */
export function usePageCopy(page: string, locale: Locale): ResolvedPage {
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: row } = useSuspenseQuery(pageContentQueryOptions(page));

  return resolvePage(page, row, locale, settings.default_locale, {
    mediaDefaults: { portrait: settings.primary_agent_photo_url ?? null },
    vars: copyVars(settings, locale),
  });
}
