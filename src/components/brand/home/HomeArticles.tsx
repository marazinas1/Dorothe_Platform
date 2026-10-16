import { useTranslation } from "react-i18next";

import { PostCard } from "@/components/brand/blog/PostCard";
import guideEnergy from "@/assets/placeholders/guide-energy.jpg";
import guideHomeValue from "@/assets/placeholders/guide-home-value.jpg";
import guideInheritance from "@/assets/placeholders/guide-inheritance.jpg";
import type { Locale } from "@/i18n/config";
import { readingMinutes } from "@/lib/posts/reading-time";
import { postViews } from "@/lib/posts/resolve";
import type { PostRow } from "@/lib/posts/types";
import { HomeTextLink } from "./HomeActions";

const PLACEHOLDER_IMAGES = [
  guideHomeValue,
  guideEnergy,
  guideInheritance,
];

export function HomeArticles({
  locale,
  posts,
  vars = {},
}: {
  locale: Locale;
  posts: PostRow[];
  /** Client words ({{region}} …) for the sample guide titles. */
  vars?: Record<string, string>;
}) {
  const { t } = useTranslation();
  const items = postViews(posts, locale).slice(0, 3);
  const placeholders = t("home.guide_placeholders", { returnObjects: true, ...vars }) as Array<{
    category: string;
    title: string;
    excerpt: string;
  }>;

  return (
    <section className="bg-card section-y-tight">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-section max-w-[24ch] text-balance">{t("home.guides_title")}</h2>
        <HomeTextLink locale={locale} to="/$locale/ratgeber">{t("home.all_articles")}</HomeTextLink>
      </div>
      <ul className="mt-10 grid gap-7 md:grid-cols-3">
        {items.length > 0
          ? items.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} metaLabel={[post.topic ? t(`blog.topics.${post.topic}`) : null, t("blog.read_minutes", { count: readingMinutes(post.body) })].filter(Boolean).join(", ")} />
            ))
          : placeholders.map((post, index) => (
              <li key={post.title}>
                <div className="aspect-[3/2] overflow-hidden bg-muted">
                  <img src={PLACEHOLDER_IMAGES[index]} alt="" loading="lazy" width={992} height={672} className="h-full w-full object-cover" />
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