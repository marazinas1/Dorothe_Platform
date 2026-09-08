import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { PublicChrome } from "@/components/public/PublicChrome";
import { HomeTemplateView } from "@/components/brand/home/HomeTemplate";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { copyVars } from "@/lib/config/site-copy";
import {
  featuredListingsQueryOptions,
  recentSoldQueryOptions,
} from "@/lib/listings/queries.functions";
import { publicCitiesQueryOptions } from "@/lib/listings/counts.functions";
import { publicTeamQueryOptions } from "@/lib/team/queries.functions";
import { featureFlagsQueryOptions } from "@/lib/config/feature-flags.functions";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import { buildHead } from "@/lib/seo/build-head";
import { resolveHomePreview } from "@/lib/home/admin.functions";
import { homeCopy, homeMediaBag } from "@/lib/home/content";
import { homeTemplate, homeTemplateKey } from "@/lib/home/templates";
import { buildThemeVariables } from "@/lib/theme/tokens";
import {
  HOMEPAGE_LISTING_LIMIT,
  applySoldPricePolicy,
  resolveSocialImage,
  soldPricesHidden,
} from "@/lib/homepage/plan";

type HomeSearch = { home?: string; t?: string };

export const Route = createFileRoute("/$locale/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    home: typeof search.home === "string" ? search.home : undefined,
    t: typeof search.t === "string" ? search.t : undefined,
  }),
  loaderDeps: ({ search }) => ({ home: search.home, token: search.t }),
  loader: async ({ context, params, deps }) => {
    const [settings, origin, featured] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      getRequestOrigin(),
      context.queryClient.ensureQueryData(featuredListingsQueryOptions),
      context.queryClient.ensureQueryData(recentSoldQueryOptions),
      context.queryClient.ensureQueryData(publicCitiesQueryOptions),
      context.queryClient.ensureQueryData(publicTeamQueryOptions),
      context.queryClient.ensureQueryData(featureFlagsQueryOptions),
    ]);

    // A signed link may render a design that is not the live one. Without a
    // valid token the parameter is ignored, so visitors always see the live page.
    let preview: string | null = null;
    if (deps.home && deps.token) {
      preview = await resolveHomePreview({ data: { template: deps.home, token: deps.token } });
    }

    return {
      settings,
      origin,
      locale: params.locale as Locale,
      socialImage: resolveSocialImage(settings, featured.items),
      preview,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale, socialImage, preview } = loaderData;
    const vars = copyVars(settings, locale);
    const title = `${translate(locale, "home.title", vars)} — ${settings.site_name}`;
    const head = buildHead({
      origin,
      path: `/${locale}`,
      locale,
      enabledLocales: settings.enabled_locales,
      defaultLocale: settings.default_locale,
      title,
      description: translate(locale, "home.description", vars),
      siteName: settings.site_name,
      ogDefaultImage: socialImage,
      ogType: "website",
    });
    if (!preview) return head;
    return { ...head, meta: [...(head.meta ?? []), { name: "robots", content: "noindex" }] };
  },
  component: HomePage,
});

/**
 * The home page renders one of the built-in designs. Which one is a client
 * decision (`site_settings.active_home_template`), overridable per request only
 * through a signed preview link. This file composes; every decision about copy,
 * photographs and price policy is resolved in @/lib/home and @/lib/homepage.
 */
function HomePage() {
  const { locale } = Route.useParams();
  const { preview } = Route.useLoaderData();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: featured } = useSuspenseQuery(featuredListingsQueryOptions);
  const { data: sold } = useSuspenseQuery(recentSoldQueryOptions);

  const l = locale as Locale;
  const key = homeTemplateKey(preview ?? settings.active_home_template);
  const template = homeTemplate(key);
  const copy = homeCopy(settings, key, l);
  const media = homeMediaBag(settings);

  return (
    <PublicChrome
      locale={l}
      settings={settings}
      heroOverlay={template.chrome.heroOverlay}
      footerTone={template.chrome.footerTone}
    >
      {/* A preview shows the design's own palette without touching the live one. */}
      {preview ? (
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{${buildThemeVariables({ ...settings, ...template.theme })}}`,
          }}
        />
      ) : null}
      <HomeTemplateView
        template={key}
        locale={l}
        settings={settings}
        copy={copy}
        media={media}
        featured={featured.items.slice(0, HOMEPAGE_LISTING_LIMIT)}
        sold={applySoldPricePolicy(sold.items.slice(0, HOMEPAGE_LISTING_LIMIT), settings)}
        hideSoldPrice={soldPricesHidden(settings)}
      />
    </PublicChrome>
  );
}
