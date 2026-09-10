import { Link, createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { PublicChrome } from "@/components/public/PublicChrome";
import { CtaBand } from "@/components/brand/CtaBand";
import { PostArticle } from "@/components/brand/blog/PostArticle";
import type { Locale } from "@/i18n/config";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { publicPostQueryOptions } from "@/lib/posts/queries.functions";
import { postView } from "@/lib/posts/resolve";
import { formatPostDate } from "@/lib/posts/date";
import { getRequestOrigin } from "@/lib/seo/origin.functions";
import { buildHead } from "@/lib/seo/build-head";
import { postJsonLd } from "@/lib/seo/post-jsonld";

export const Route = createFileRoute("/$locale/ratgeber/$slug")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const [settings, origin, row] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      getRequestOrigin(),
      context.queryClient.ensureQueryData(publicPostQueryOptions(params.slug)),
    ]);
    if (!row) throw notFound();
    // An old address must keep working, pointing at the current one.
    if (row.slug !== params.slug) {
      throw redirect({
        to: "/$locale/ratgeber/$slug",
        params: { locale: params.locale, slug: row.slug },
        statusCode: 301,
      });
    }
    return {
      settings,
      origin,
      post: postView(row, params.locale),
      locale: params.locale as Locale,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "…" }, { name: "robots", content: "noindex" }] };
    }
    const { settings, origin, locale, post } = loaderData;
    const canonical = `${origin}/${locale}/ratgeber/${post.slug}`;
    const head = buildHead({
      origin,
      path: `/${locale}/ratgeber/${post.slug}`,
      locale,
      enabledLocales: settings.enabled_locales,
      defaultLocale: settings.default_locale,
      title: `${post.metaTitle} — ${settings.site_name}`,
      description: post.metaDescription,
      siteName: settings.site_name,
      ogType: "article",
      ogImage: post.cover,
      ogDefaultImage: settings.og_default_image,
    });
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(postJsonLd(settings, post, canonical)),
        },
      ],
    };
  },
  component: PostDetail,
  notFoundComponent: NotFoundBody,
});

function NotFoundBody() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-[900px] px-6 py-32 lg:px-10">
      <h1 className="font-heading text-4xl">{t("blog.detail.unavailable_title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("blog.detail.unavailable_body")}</p>
    </div>
  );
}

function PostDetail() {
  const { locale, slug } = Route.useParams();
  const { t } = useTranslation();
  const l = locale as Locale;
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const { data: row } = useSuspenseQuery(publicPostQueryOptions(slug));
  if (!row) return null;
  const post = postView(row, l);

  return (
    <PublicChrome locale={l} settings={settings}>
      <PostArticle
        post={post}
        dateLabel={formatPostDate(post.publishedAt, l)}
        backSlot={
          <Link
            to="/$locale/ratgeber"
            params={{ locale: l }}
            className="text-[14px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("blog.detail.back")}
          </Link>
        }
      />
      <CtaBand locale={l} settings={settings} />
    </PublicChrome>
  );
}
