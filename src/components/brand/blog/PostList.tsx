import type { Locale } from "@/i18n/config";
import type { PostView } from "@/lib/posts/types";

import { PostCard } from "./PostCard";

type Props = {
  posts: PostView[];
  locale: Locale;
  title: string;
  intro?: string;
  emptyLabel: string;
  formatDate: (iso: string | null) => string | null;
};

/** The article index. Presentational only. */
export function PostList({
  posts,
  locale,
  title,
  intro,
  emptyLabel,
  formatDate,
}: Props) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-[1220px] px-6 lg:px-8">
        <h1 className="text-section max-w-[40ch] text-balance">{title}</h1>
        {intro ? (
          <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.66] text-muted-foreground">
            {intro}
          </p>
        ) : null}

        {posts.length === 0 ? (
          <p className="mt-12 text-[15px] text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                locale={locale}
                dateLabel={formatDate(post.publishedAt)}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
