import { Link } from "@tanstack/react-router";

import type { Locale } from "@/i18n/config";
import type { PostView } from "@/lib/posts/types";

const META = "text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

/** One article teaser (reference `.art`). `featured` = the wide split lead story. */
export function PostCard({
  post,
  locale,
  metaLabel,
  featured = false,
}: {
  post: PostView;
  locale: Locale;
  metaLabel: string | null;
  featured?: boolean;
}) {
  // No cover = text-first card (editorial standard); never a grey "missing image" box.
  const img = post.cover ? (
    <div className={`${featured ? "aspect-[16/10]" : "aspect-[3/2]"} overflow-hidden bg-muted`}>
      <img src={post.cover} alt={post.coverAlt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  ) : null;

  if (featured) {
    return (
      <Link
        to="/$locale/ratgeber/$slug"
        params={{ locale, slug: post.slug }}
        className={`group grid items-center gap-10 lg:gap-20 ${img ? "md:grid-cols-2" : "border-t border-border pt-10"}`}
      >
        {img}
        <div>
          {metaLabel ? <span className={META}>{metaLabel}</span> : null}
          <h2 className="mt-3.5 text-[clamp(28px,3.2vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-balance transition-opacity group-hover:opacity-70">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="mt-4 max-w-[56ch] text-[clamp(18px,1.6vw,21px)] leading-[1.55] text-muted-foreground">{post.excerpt}</p>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <li>
      <Link to="/$locale/ratgeber/$slug" params={{ locale, slug: post.slug }} className="group block">
        {img}
        {metaLabel ? <span className={`${META} mt-[18px] block`}>{metaLabel}</span> : null}
        <h3 className="mt-[18px] text-[22px] font-bold leading-[1.25] tracking-[-0.01em] text-balance transition-opacity group-hover:opacity-70">
          {post.title}
        </h3>
        {post.excerpt ? <p className="mt-2.5 text-[15.5px] leading-[1.62] text-muted-foreground">{post.excerpt}</p> : null}
      </Link>
    </li>
  );
}
