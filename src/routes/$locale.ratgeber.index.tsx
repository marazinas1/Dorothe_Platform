import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { PublicChrome } from "@/components/public/PublicChrome";
import { PostList } from "@/components/brand/blog/PostList";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { publicPostsQueryOptions } from "@/lib/posts/queries.functions";
import { pageContentQueryOptions } from "@/lib/pages/queries.functions";
import { usePageCopy } from "@/lib/pages/use-page-copy";
import { postViews } from "@/lib/posts/resolve";
import { readingMinutes } from "@/lib/posts/reading-time";
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
      context.queryClient.ensureQueryData(pageContentQueryOptions("blog")),
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
  const copy = usePageCopy("blog", l);

  return (
    <PublicChrome locale={l} settings={settings}>
      <PostList
        posts={postViews(rows, l)}
        locale={l}
        title={copy.text("headline")}
        intro={copy.text("intro")}
        emptyLabel={copy.text("empty")}
        metaFor={(post) =>
          [post.topic ? t(`blog.topics.${post.topic}`) : null, t("blog.read_minutes", { count: readingMinutes(post.body) })]
            .filter(Boolean)
            .join(", ")
        }
      />
    </PublicChrome>
  );
}
