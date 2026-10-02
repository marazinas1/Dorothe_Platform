import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { stripSearchParams } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { zodValidator } from "@tanstack/zod-adapter";

import { PublicChrome } from "@/components/public/PublicChrome";
import { ListingCard } from "@/components/brand/ListingCard";
import { ListingsMap } from "@/components/brand/ListingsMap";
import { ListingsNeedCta } from "@/components/brand/ListingsNeedCta";

import { FiltersBar } from "@/components/public/FiltersBar";
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
import { copyVars, serviceRegion } from "@/lib/config/site-copy";
import { pageContentQueryOptions } from "@/lib/pages/queries.functions";
import { usePageCopy } from "@/lib/pages/use-page-copy";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import { buildHead } from "@/lib/seo/build-head";
import { Button, buttonClass } from "@/components/brand/ui/Button";
import { ListingIcon } from "@/components/brand/ui/ListingIcon";

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
          deal: s.deal || "sale",
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
      context.queryClient.ensureQueryData(pageContentQueryOptions("properties")),
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
  const copy = usePageCopy("properties", locale as Locale);

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const gotoPage = (n: number) =>
    navigate({
      params: { locale },
      search: (prev: ListingsSearch) => ({ ...prev, page: n }),
    });

  const views = [
    { key: "grid", icon: "grid" },
    { key: "list", icon: "list" },
    { key: "map", icon: "map" },
  ] as const;
  const view = search.view === "list" || search.view === "map" ? search.view : "grid";
  const sortKey = ["newest", "price_asc", "price_desc"].includes(search.sort) ? search.sort : "newest";

  return (
    <PublicChrome locale={locale as Locale} settings={settings}>
      <section className="border-b border-border pb-8 pt-14 md:pb-10 md:pt-20">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <h1 className="font-heading text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.08]">
          {t("listings.catalogue_title", { region: serviceRegion(settings, locale) })}
        </h1>
        <p className="mt-4 max-w-xl text-[17px] text-muted-foreground">{t("listings.catalogue_intro")}</p>

        <FiltersBar key={JSON.stringify(search)} locale={locale as Locale} search={search} total={data.total} />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 pb-4 pt-9 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-semibold">
              {t("listings.results_count").replace("{{count}}", String(data.total))}
            </span>
            <span className="text-sm text-muted-foreground">
              {t("listings.results_context", { sort: t(`listings.sort_short.${sortKey}`).toLowerCase() })}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <label className={buttonClass({ variant: "ghost", size: "sm", className: "relative px-3" })}>
              <span className="btn-noir">{t("listings.sort.prefix")}: {t(`listings.sort_short.${sortKey}`)}</span>
              <ListingIcon name="chev" className="size-4" />
              <select
                aria-label={t("listings.sort.label")}
                value={sortKey}
                onChange={(e) =>
                  navigate({ params: { locale }, search: (prev: ListingsSearch) => ({ ...prev, sort: e.target.value, page: 1 }) })
                }
                className="absolute inset-0 cursor-pointer opacity-0"
              >
                {["newest", "price_asc", "price_desc"].map((k) => (
                  <option key={k} value={k}>{t(`listings.sort.${k}`)}</option>
                ))}
              </select>
            </label>
            <div role="group" aria-label={t("listings.view.grid")} className="inline-flex rounded-[var(--radius-button)] border border-border">
              {views.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={view === v.key}
                  aria-label={t(`listings.view.${v.key}`)}
                  onClick={() => navigate({ params: { locale }, search: (prev: ListingsSearch) => ({ ...prev, view: v.key }) })}
                  className={`grid h-[42px] w-11 cursor-pointer place-items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    view === v.key ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListingIcon name={v.icon} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === "map" ? (
          <ListingsMap items={data.items} locale={locale as Locale} settings={settings} alwaysOpen />
        ) : data.items.length === 0 ? (
          <div className="py-24 text-center text-sm text-muted-foreground">{copy.text("empty")}</div>
        ) : view === "list" ? (
          <div className="border-b border-border">
            {data.items.map((l, i) => (
              <ListingCard key={l.id} listing={l} locale={locale as Locale} settings={settings} layout="row" eager={i < 2} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((l, i) => (
              <ListingCard key={l.id} listing={l} locale={locale as Locale} settings={settings} eager={i < 3} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-16 flex items-center justify-between border-t border-border pt-6 text-sm">
            <Button disabled={search.page <= 1} onClick={() => gotoPage(search.page - 1)} variant="ghost" size="sm">
              {t("listings.pager.prev")}
            </Button>
            <div className="tabular-figures text-muted-foreground">
              {t("listings.pager.page").replace("{{n}}", String(search.page)).replace("{{total}}", String(totalPages))}
            </div>
            <Button disabled={search.page >= totalPages} onClick={() => gotoPage(search.page + 1)} variant="ghost" size="sm">
              {t("listings.pager.next")}
            </Button>
          </nav>
        ) : null}
      </section>
      <ListingsNeedCta locale={locale as Locale} />
    </PublicChrome>
  );
}
