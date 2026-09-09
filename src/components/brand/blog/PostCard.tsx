import { Link } from "@tanstack/react-router";

import type { Locale } from "@/i18n/config";
import type { PostView } from "@/lib/posts/types";

/** One article teaser. Presentational only — no data fetching. */
export function PostCard({
  post,
  locale,
  dateLabel,
}: {
  post: PostView;
  locale: Locale;
  dateLabel: string | null;
}) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-border/70 bg-card">
      <Link
        to="/$locale/ratgeber/$slug"
        params={{ locale, slug: post.slug }}
        className="flex h-full flex-col"
      >
        {post.cover ? (
          <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
            <img
              src={post.cover}
              alt={post.coverAlt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col px-[26px] py-[26px]">
          {dateLabel ? (
            <div className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
              {dateLabel}
            </div>
          ) : null}
          <h3 className="mt-3 text-[19px] leading-[1.3] font-semibold text-balance">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="mt-3 text-[14.5px] leading-[1.62] text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
