import { useTranslation } from "react-i18next";

import { PostCard } from "@/components/brand/blog/PostCard";
import type { Locale } from "@/i18n/config";
import { formatPostDate } from "@/lib/posts/date";
import { postViews } from "@/lib/posts/resolve";
import type { PostRow } from "@/lib/posts/types";
import { HomeTextLink } from "./HomeActions";

export function HomeArticles({ locale, posts }: { locale: Locale; posts: PostRow[] }) {
  const { t } = useTranslation();
  const items = postViews(posts, locale).slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="bg-card py-[72px] lg:py-[88px]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-section max-w-[24ch] text-balance">{t("home.guides_title")}</h2>
        <HomeTextLink locale={locale} to="/$locale/ratgeber">{t("home.all_articles")}</HomeTextLink>
      </div>
      <ul className="mt-10 grid gap-7 md:grid-cols-3">
        {items.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} dateLabel={formatPostDate(post.publishedAt, locale)} />
        ))}
      </ul>
      </div>
    </section>
  );
}