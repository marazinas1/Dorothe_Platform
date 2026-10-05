import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { PublicChrome } from "@/components/public/PublicChrome";
import { PageIntro } from "@/components/brand/PageIntro";
import { TextSection } from "@/components/brand/TextSection";
import { DarkActionBand } from "@/components/brand/DarkActionBand";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { pageContentQueryOptions } from "@/lib/pages/queries.functions";
import { usePageCopy } from "@/lib/pages/use-page-copy";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import { buildHead } from "@/lib/seo/build-head";

export const Route = createFileRoute("/$locale/erben")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const [settings, origin] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      getRequestOrigin(),
      context.queryClient.ensureQueryData(pageContentQueryOptions("inheritance")),
    ]);
    return { settings, origin, locale: params.locale as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale } = loaderData;
    const title = `${translate(locale, "pages.inheritance.title")} — ${settings.site_name}`;
    return buildHead({
      origin,
      path: `/${locale}/erben`,
      locale,
      enabledLocales: settings.enabled_locales,
      defaultLocale: settings.default_locale,
      title,
      description: translate(locale, "pages.inheritance.meta_description"),
      siteName: settings.site_name,
      ogDefaultImage: settings.og_default_image,
    });
  },
  component: InheritancePage,
});

function InheritancePage() {
  const { locale } = Route.useParams();
  const { t } = useTranslation();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const copy = usePageCopy("inheritance", locale as Locale);

  return (
    <PublicChrome locale={locale as Locale} settings={settings}>
      <PageIntro
        kicker={copy.text("kicker")}
        headline={copy.text("headline")}
        lead={copy.text("intro")}
        image={copy.media("hero_photo")}
      />

      <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 lg:py-28">
        <p className="max-w-3xl text-xl leading-9 text-foreground">{t("pages.inheritance.bridge")}</p>
        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
          <div><h2 className="text-section">{copy.text("appraisal_title")}</h2><p className="mt-6 text-base leading-8 text-muted-foreground">{copy.text("appraisal_body")}</p></div>
          <div><h2 className="text-section">{copy.text("community_title")}</h2><p className="mt-6 text-base leading-8 text-muted-foreground">{copy.text("community_body")}</p></div>
        </div>
      </section>

      <TextSection
        title={copy.text("credential_title")}
        body={copy.text("credential_body")}
        quiet
      />

      <DarkActionBand title={copy.text("contact_title")} body={copy.text("contact_body")} action={t("pages.inheritance.contact_link")} locale={locale as Locale} intent="other" />
    </PublicChrome>
  );
}
