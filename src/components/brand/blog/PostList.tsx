import type { Locale } from "@/i18n/config";
import type { PostView } from "@/lib/posts/types";

import { PostCard } from "./PostCard";

type Props = {
  posts: PostView[];
  locale: Locale;
  title: string;
  intro?: string;
  emptyLabel: string;
  metaFor: (post: PostView) => string | null;
};

/** Guides index per reference: page hero, one lead story, then a three-column grid. */
export function PostList({ posts, locale, title, intro, emptyLabel, metaFor }: Props) {
  const [lead, ...rest] = posts;
  return (
    <>
      <div className="border-b border-border pt-24 pb-16">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <h1 className="text-[clamp(34px,4.4vw,56px)] font-bold leading-[1.06] tracking-[-0.03em] text-balance">{title}</h1>
          {intro ? (
            <p className="mt-5 max-w-[56ch] text-[clamp(18px,1.6vw,21px)] leading-[1.55] text-muted-foreground">{intro}</p>
          ) : null}
        </div>
      </div>
      <section className="section-y">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          {!lead ? (
            <p className="text-[15.5px] text-muted-foreground">{emptyLabel}</p>
          ) : (
            <>
              <PostCard featured post={lead} locale={locale} metaLabel={metaFor(lead)} />
              {rest.length > 0 ? (
                <ul className="mt-24 grid gap-7 md:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} locale={locale} metaLabel={metaFor(post)} />
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
