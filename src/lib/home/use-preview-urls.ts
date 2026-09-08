import { useQuery } from "@tanstack/react-query";

import { createHomePreviewLink } from "./admin.functions";
import { HOME_TEMPLATE_KEYS, type HomeTemplateKey } from "./templates";

/**
 * Signed preview URLs for every design, minted once per admin visit. The
 * gallery uses them for the miniature render; the Preview action reuses the
 * same URL in a new tab, so what you click is exactly what you saw.
 */
export function usePreviewUrls(locale: string) {
  const query = useQuery({
    queryKey: ["home-preview-urls", locale],
    staleTime: 20 * 60 * 1000,
    queryFn: async () => {
      const entries = await Promise.all(
        HOME_TEMPLATE_KEYS.map(async (key) => {
          const link = await createHomePreviewLink({ data: { template: key } });
          return [key, `/${locale}?home=${link.template}&t=${encodeURIComponent(link.token)}`] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<HomeTemplateKey, string>;
    },
  });

  return (key: HomeTemplateKey): string | null => query.data?.[key] ?? null;
}
