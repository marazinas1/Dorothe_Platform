import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { stripSearchParams } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { zodValidator } from "@tanstack/zod-adapter";

import { PublicChrome } from "@/components/public/PublicChrome";
import { CtaBand } from "@/components/brand/CtaBand";
import { ListingCard } from "@/components/brand/ListingCard";
import { ListingsMap } from "@/components/brand/ListingsMap";

import { FiltersBar } from "@/components/public/FiltersBar";
import { LISTING_CARD_GRID } from "@/lib/homepage/card-grid";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { listPublicListings } from "@/lib/listings/queries.functions";
import {
  listingsSearchSchema,
  SEARCH_DEFAULTS,
  canonicalListingsQuery,
  PAGE_SIZE,
  type ListingsSearch,
} from "@/lib/listings/search-schema";
import { copyVars } from "@/lib/config/site-copy";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import { buildHead } from "@/lib/seo/build-head";

function keyFor(s: ListingsSearch) {
  return ["listings", "index", s] as const;
}

function statusesFor(status: string): string[] | undefined {
  if (status === "archive") return ["sold", "rented"];
  if (status === "all") return ["active", "coming_soon", "sold", "rented"];
  return ["active", "coming_soon"];
}

function listingsQueryOptions(s: ListingsSearch) {
  return queryOptions({
    queryKey: keyFor(s),
    queryFn: () =>
      listPublicListings({
        data: {
          deal: s.deal,
          type: s.type,
          city: s.city,
          rooms_min: s.rooms_min,
          price_min: s.price_min,
          price_max: s.price_max,
          area_min: s.area_min,
          sort: s.sort,
          page: s.page,
          onlyStatus: statusesFor(s.status),
        },
      } as any),
    staleTime: 15_000,
  });
}

export const Route = createFileRoute("/$locale/immobilien/")({
  staticData: { sitemap: true },
  validateSearch: zodValidator(listingsSearchSchema),
  search: {
    // Strip any param that equals its default so shared/bookmarked URLs
    // stay clean (?type=house instead of ?deal=&type=house&city=…).
    middlewares: [stripSearchParams(SEARCH_DEFAULTS)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps }) => {
    const [settings, origin] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      getRequestOrigin(),
      context.queryClient.ensureQueryData(listingsQueryOptions(deps)),
    ]);
    return { settings, origin, locale: params.locale as Locale, search: deps };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale, search } = loaderData;
    const title = `${translate(locale, "listings.title")} — ${settings.site_name}`;
    const path = `/${locale}/immobilien${canonicalListingsQuery(search)}`;
    return buildHead({
      origin,
      path,
      locale,
      enabledLocales: settings.enabled_locales,
      defaultLocale: settings.default_locale,
      title,
      description: translate(locale, "listings.description", copyVars(settings, locale)),
      siteName: settings.site_name,
      ogDefaultImage: settings.og_default_image,
    });
  },
  component: ListingsIndex,
});

function ListingsIndex() {
  const { locale } = Route.useParams();
  const search = Route.useSearch();
  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/$locale/immobilien/" });
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data } = useSuspenseQuery(listingsQueryOptions(search));

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const gotoPage = (n: number) =>
    navigate({
      params: { locale },
      search: (prev: ListingsSearch) => ({ ...prev, page: n }),
    });

  return (
    <PublicChrome locale={locale as Locale} settings={settings}>
      <section className="mx-auto max-w-[1400px] px-6 pt-24 lg:px-10">
        <h1 className="font-heading text-5xl md:text-6xl">{t("listings.title")}</h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          {t("listings.description", copyVars(settings, locale as Locale))}
        </p>


        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {(["available", "archive", "all"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() =>
                  navigate({
                    params: { locale },
                    search: (prev: ListingsSearch) => ({ ...prev, status: st, page: 1 }),
                  })
                }
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${
                  search.status === st
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(`listings.tabs.${st}`)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {(["grid", "map"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() =>
                  navigate({
                    params: { locale },
                    search: (prev: ListingsSearch) => ({ ...prev, view: v }),
                  })
                }
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${
                  search.view === v
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(`listings.view.${v}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <FiltersBar locale={locale as Locale} search={search} total={data.total} />
        </div>


        {search.view === "map" ? (
          <div className="mt-10">
            <ListingsMap
              items={data.items}
              locale={locale as Locale}
              settings={settings}
              alwaysOpen
            />
          </div>
        ) : null}

        {data.items.length === 0 ? (
          <div className="py-24 text-center text-sm text-muted-foreground">
            {t("listings.empty")}
          </div>
        ) : (
          <div className={`mt-12 ${LISTING_CARD_GRID}`}>
            {data.items.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                locale={locale as Locale}
                settings={settings}
                size="compact"
              />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-16 flex items-center justify-between border-t border-border pt-6 text-sm">
            <button
              type="button"
              disabled={search.page <= 1}
              onClick={() => gotoPage(search.page - 1)}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              ← {t("listings.pager.prev")}
            </button>
            <div className="tabular-figures text-muted-foreground">
              {t("listings.pager.page")
                .replace("{{n}}", String(search.page))
                .replace("{{total}}", String(totalPages))}
            </div>
            <button
              type="button"
              disabled={search.page >= totalPages}
              onClick={() => gotoPage(search.page + 1)}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              {t("listings.pager.next")} →
            </button>
          </nav>
        ) : null}

        {/* Keep Link import used to reduce dead-code warnings */}
        <span className="hidden">
          <Link to="/$locale" params={{ locale }} />
        </span>
      </section>
      <CtaBand locale={locale as Locale} settings={settings} />
    </PublicChrome>
  );
}
