import { useTranslation } from "react-i18next";

import { PostCard } from "@/components/brand/blog/PostCard";
import type { Locale } from "@/i18n/config";
import { formatPostDate } from "@/lib/posts/date";
import { postViews } from "@/lib/posts/resolve";
import type { PostRow } from "@/lib/posts/types";

export function HomeArticles({ locale, posts }: { locale: Locale; posts: PostRow[] }) {
  const { t } = useTranslation();
  const items = postViews(posts, locale).slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-[72px] md:px-10 lg:py-[120px]">
      <h2 className="text-section max-w-[20ch] text-balance">{t("blog.title")}</h2>
      <p className="mt-4 max-w-[60ch] text-muted-foreground">{t("blog.intro")}</p>
      <ul className="mt-12 grid gap-7 md:grid-cols-3">
        {items.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} dateLabel={formatPostDate(post.publishedAt, locale)} />
        ))}
      </ul>
    </section>
  );
}