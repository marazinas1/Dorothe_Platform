import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ContactDetails } from "@/components/brand/ContactDetails";
import { ContactIntentForm, type ContactIntent } from "@/components/brand/ContactIntentForm";
import { PublicChrome } from "@/components/public/PublicChrome";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { openingHoursRows } from "@/lib/config/opening-hours-display";
import { pageContentQueryOptions } from "@/lib/pages/queries.functions";
import { usePageCopy } from "@/lib/pages/use-page-copy";
import { buildHead } from "@/lib/seo/build-head";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import i18n from "@/i18n/config";

type ContactSearch = { intent: ContactIntent; listing?: string; title?: string };

export const Route = createFileRoute("/$locale/kontakt")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    intent: search.intent === "looking" || search.intent === "other" ? search.intent : "selling",
    listing: typeof search.listing === "string" ? search.listing : undefined,
    title: typeof search.title === "string" ? search.title.slice(0, 240) : undefined,
  }),
  loader: async ({ context, params }) => {
    const [settings, origin] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions), getRequestOrigin(),
      context.queryClient.ensureQueryData(pageContentQueryOptions("contact")),
    ]);
    return { settings, origin, locale: params.locale as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale } = loaderData;
    return buildHead({
      origin, path: `/${locale}/kontakt`, locale,
      enabledLocales: settings.enabled_locales, defaultLocale: settings.default_locale,
      title: `${translate(locale, "pages.contact.title")} — ${settings.site_name}`,
      description: translate(locale, "pages.contact.meta_description"), siteName: settings.site_name,
      ogDefaultImage: settings.og_default_image,
    });
  },
  component: ContactPage,
});

function ContactPage() {
  const { locale } = Route.useParams();
  const search = Route.useSearch();
  const currentLocale = locale as Locale;
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const copy = usePageCopy("contact", currentLocale);
  const configured = openingHoursRows(settings.opening_hours ?? {}, currentLocale, i18n.t.bind(i18n));
  const hasHours = Object.keys(settings.opening_hours ?? {}).some((key) => key !== "exceptions");

  return (
    <PublicChrome locale={currentLocale} settings={settings}>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1120px] px-5 py-16 md:px-10 md:py-24">
          <h1 className="max-w-5xl font-heading text-4xl font-bold leading-[1.06] md:text-6xl">{copy.text("headline")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{copy.text("form_intro")}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1120px] gap-14 px-5 py-16 md:px-10 lg:grid-cols-[0.85fr_1.2fr] lg:gap-20 lg:py-20">
        <ContactDetails settings={settings} hours={hasHours ? configured.weekly : []} />
        <ContactIntentForm initialIntent={search.intent} listingId={search.listing} listingTitle={search.title} locale={currentLocale} />
      </section>
    </PublicChrome>
  );
}