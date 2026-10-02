import { useTranslation } from "react-i18next";

import { PostCard } from "@/components/brand/blog/PostCard";
import type { Locale } from "@/i18n/config";
import { formatPostDate } from "@/lib/posts/date";
import { postViews } from "@/lib/posts/resolve";
import type { PostRow } from "@/lib/posts/types";
import { HomeTextLink } from "./HomeActions";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=75",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=75",
];

export function HomeArticles({ locale, posts }: { locale: Locale; posts: PostRow[] }) {
  const { t } = useTranslation();
  const items = postViews(posts, locale).slice(0, 3);
  const placeholders = t("home.guide_placeholders", { returnObjects: true }) as Array<{
    category: string;
    title: string;
    excerpt: string;
  }>;

  return (
    <section className="bg-card py-[72px] lg:py-[88px]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-section max-w-[24ch] text-balance">{t("home.guides_title")}</h2>
        <HomeTextLink locale={locale} to="/$locale/ratgeber">{t("home.all_articles")}</HomeTextLink>
      </div>
      <ul className="mt-10 grid gap-7 md:grid-cols-3">
        {items.length > 0
          ? items.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} dateLabel={formatPostDate(post.publishedAt, locale)} />
            ))
          : placeholders.map((post, index) => (
              <li key={post.title}>
                <div className="aspect-[3/2] overflow-hidden bg-muted">
                  <img src={PLACEHOLDER_IMAGES[index]} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="mt-[18px] text-xs uppercase tracking-[0.14em] text-muted-foreground">{post.category}</div>
                <h3 className="mt-3 text-[19px] leading-[1.3] font-semibold text-balance">{post.title}</h3>
                <p className="mt-3 text-[15.5px] leading-[1.62] text-muted-foreground">{post.excerpt}</p>
              </li>
            ))}
      </ul>
      </div>
    </section>
  );
}