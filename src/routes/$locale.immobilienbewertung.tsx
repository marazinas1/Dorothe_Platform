import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, FileText, Scale, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PublicChrome } from "@/components/public/PublicChrome";
import { ValuationWizard } from "@/components/brand/valuation/ValuationWizard";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { buildHead } from "@/lib/seo/build-head";
import { getRequestOrigin } from "@/lib/seo/origin.functions";

export const Route = createFileRoute("/$locale/immobilienbewertung")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { address?: string; type?: string } => ({
    address: typeof search.address === "string" ? search.address.slice(0, 160) : undefined,
    type: typeof search.type === "string" ? search.type.slice(0, 50) : undefined,
  }),
  loader: async ({ context, params }) => {
    const [settings, origin] = await Promise.all([context.queryClient.ensureQueryData(siteSettingsQueryOptions), getRequestOrigin()]);
    return { settings, origin, locale: params.locale as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale } = loaderData;
    return buildHead({ origin, path: `/${locale}/immobilienbewertung`, locale, enabledLocales: settings.enabled_locales, defaultLocale: settings.default_locale, title: `${translate(locale, "pages.valuation.title")} — ${settings.site_name}`, description: translate(locale, "pages.valuation.meta_description"), siteName: settings.site_name, ogDefaultImage: settings.og_default_image });
  },
  component: ValuationPage,
});

function ValuationPage() {
  const { locale } = Route.useParams();
  const search = Route.useSearch();
  const { t } = useTranslation();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const items = t("pages.valuation.reference_deliverables", { returnObjects: true }) as { title: string; body: string }[];
  const icons = [CalendarDays, Scale, FileText, Users];
  return (
    <PublicChrome locale={locale as Locale} settings={settings}>
      <section className="mx-auto max-w-[1280px] px-5 pt-20 md:px-10 lg:pt-28">
        <h1 className="max-w-[18ch] font-heading text-5xl font-bold leading-[1.04] md:text-7xl">{t("pages.valuation.reference_headline")}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">{t("pages.valuation.reference_intro")}</p>
      </section>
      <section className="mx-auto grid max-w-[1280px] gap-14 px-5 py-16 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
        <div>
          <h2 className="text-section-sm">{t("pages.valuation.deliverables_title")}</h2>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {items.map((item, index) => { const Icon = icons[index] ?? Scale; return <div key={item.title} className="grid grid-cols-[28px_1fr] gap-4 py-6"><Icon className="size-5" /><div><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p></div></div>; })}
          </div>
          <div className="mt-10 bg-card p-7"><h3 className="font-heading text-xl font-bold">{t("pages.valuation.inheritance_title")}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("pages.valuation.inheritance_body")}</p><Link to="/$locale/erben" params={{ locale }} className="btn-noir mt-4 inline-flex min-h-11 items-center underline underline-offset-[6px]">{t("pages.valuation.inheritance_link")}</Link></div>
        </div>
        <div className="border border-border p-6 md:p-9"><ValuationWizard address={search.address} type={search.type} /></div>
      </section>
    </PublicChrome>
  );
}