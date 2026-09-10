import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { PublicChrome } from "@/components/public/PublicChrome";
import { CtaBand } from "@/components/brand/CtaBand";
import { PostList } from "@/components/brand/blog/PostList";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { publicPostsQueryOptions } from "@/lib/posts/queries.functions";
import { postViews } from "@/lib/posts/resolve";
import { formatPostDate } from "@/lib/posts/date";
import { copyVars } from "@/lib/config/site-copy";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import { buildHead } from "@/lib/seo/build-head";

export const Route = createFileRoute("/$locale/ratgeber/")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const [settings, origin] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      getRequestOrigin(),
      context.queryClient.ensureQueryData(publicPostsQueryOptions),
    ]);
    return { settings, origin, locale: params.locale as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "…" }] };
    const { settings, origin, locale } = loaderData;
    return buildHead({
      origin,
      path: `/${locale}/ratgeber`,
      locale,
      enabledLocales: settings.enabled_locales,
      defaultLocale: settings.default_locale,
      title: `${translate(locale, "blog.title")} — ${settings.site_name}`,
      description: translate(locale, "blog.meta_description", copyVars(settings, locale)),
      siteName: settings.site_name,
      ogDefaultImage: settings.og_default_image,
    });
  },
  component: BlogIndex,
});

function BlogIndex() {
  const { locale } = Route.useParams();
  const { t } = useTranslation();
  const l = locale as Locale;
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: rows } = useSuspenseQuery(publicPostsQueryOptions);

  return (
    <PublicChrome locale={l} settings={settings}>
      <PostList
        posts={postViews(rows, l)}
        locale={l}
        title={t("blog.title")}
        intro={t("blog.intro")}
        emptyLabel={t("blog.empty")}
        formatDate={(iso) => formatPostDate(iso, l)}
      />
      <CtaBand locale={l} settings={settings} />
    </PublicChrome>
  );
}
