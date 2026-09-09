import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { PublicChrome } from "@/components/public/PublicChrome";
import { H1Home } from "@/components/brand/home/h1/H1Home";
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
import { homeCopy, homeMediaBag } from "@/lib/home/content";
import { homeJsonLd } from "@/lib/seo/home-jsonld";
import { HOME_CHROME } from "@/lib/home/layout";
import {
  HOMEPAGE_LISTING_LIMIT,
  applySoldPricePolicy,
  resolveSocialImage,
  soldPricesHidden,
} from "@/lib/homepage/plan";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ context, params }) => {
    const [settings, origin, featured] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      getRequestOrigin(),
      context.queryClient.ensureQueryData(featuredListingsQueryOptions),
      context.queryClient.ensureQueryData(recentSoldQueryOptions),
      context.queryClient.ensureQueryData(publicCitiesQueryOptions),
      context.queryClient.ensureQueryData(publicTeamQueryOptions),
      context.queryClient.ensureQueryData(featureFlagsQueryOptions),
    ]);

    return {
      settings,
      origin,
      locale: params.locale as Locale,
      socialImage: resolveSocialImage(settings, featured.items),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale, socialImage } = loaderData;
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
    const copy = homeCopy(settings, locale);
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(homeJsonLd(settings, copy, `${origin}/${locale}`)),
        },
      ],
    };
  },

  component: HomePage,
});

/**
 * The home page. This file composes only; every decision about copy,
 * photographs and price policy is resolved in @/lib/home and @/lib/homepage.
 */
function HomePage() {
  const { locale } = Route.useParams();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: featured } = useSuspenseQuery(featuredListingsQueryOptions);
  const { data: sold } = useSuspenseQuery(recentSoldQueryOptions);

  const l = locale as Locale;
  const copy = homeCopy(settings, l);
  const media = homeMediaBag(settings);

  return (
    <PublicChrome
      locale={l}
      settings={settings}
      heroOverlay={HOME_CHROME.heroOverlay}
      footerTone={HOME_CHROME.footerTone}
    >
      <H1Home
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
