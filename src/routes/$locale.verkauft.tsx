import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { applySoldPricePolicy, soldPricesHidden } from "@/lib/homepage/plan";
import { PublicChrome } from "@/components/public/PublicChrome";
import { DarkActionBand } from "@/components/brand/DarkActionBand";
import { ListingCard } from "@/components/brand/ListingCard";
import { LISTING_CARD_GRID } from "@/lib/homepage/card-grid";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { listPublicListings } from "@/lib/listings/queries.functions";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import { buildHead } from "@/lib/seo/build-head";

const soldOpts = queryOptions({
  queryKey: ["listings", "sold-archive"],
  queryFn: () =>
    listPublicListings({
      data: {
        deal: "",
        type: "",
        city: "",
        rooms_min: 0,
        price_min: 0,
        price_max: 0,
        area_min: 0,
        sort: "newest",
        page: 1,
        onlyStatus: ["sold", "rented"],
        limit: 24,
      },
    } as any),
  staleTime: 60_000,
});

export const Route = createFileRoute("/$locale/verkauft")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const [settings, origin] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      getRequestOrigin(),
      context.queryClient.ensureQueryData(soldOpts),
    ]);
    return { settings, origin, locale: params.locale as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale } = loaderData;
    const title = `${translate(locale, "listings.sold_title")} — ${settings.site_name}`;
    return buildHead({
      origin,
      path: `/${locale}/verkauft`,
      locale,
      enabledLocales: settings.enabled_locales,
      defaultLocale: settings.default_locale,
      title,
      description: translate(locale, "listings.sold_description"),
      siteName: settings.site_name,
      ogDefaultImage: settings.og_default_image,
    });
  },
  component: SoldArchive,
});

function SoldArchive() {
  const { locale } = Route.useParams();
  const { t } = useTranslation();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data } = useSuspenseQuery(soldOpts);
  // Achieved prices stay hidden unless the client turns them on.
  const items = applySoldPricePolicy(data.items, settings);

  return (
    <PublicChrome locale={locale as Locale} settings={settings}>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 lg:py-28">
        <h1 className="max-w-[18ch] font-heading text-5xl font-bold leading-[1.04] md:text-7xl">{t("listings.sold_title")}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("listings.sold_description")}
        </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 lg:py-20">
        {items.length === 0 ? (
          <div className="py-24 text-center text-sm text-muted-foreground">
            {t("listings.sold_empty")}
          </div>
        ) : (
          <div className={LISTING_CARD_GRID}>
            {items.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                locale={locale as Locale}
                settings={settings}
                size="compact"
                hidePrice={soldPricesHidden(settings)}
                archived
              />
            ))}
          </div>
        )}
      </section>
      <DarkActionBand title={t("listings.sold_cta_title")} body={t("listings.sold_cta_body")} action={t("pages.selling.cta_button")} locale={locale as Locale} phone={settings.contact_phone} />
    </PublicChrome>
  );
}
