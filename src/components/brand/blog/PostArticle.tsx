import type { ReactNode } from "react";

import type { PostView } from "@/lib/posts/types";

/**
 * One article per reference: crumb, title, byline, cover, 760px body, author
 * box with one primary action. Body is plain text with blank-line paragraphs;
 * a line starting with "## " becomes a subheading.
 */
export function PostArticle({
  post,
  crumb,
  byline,
  author,
}: {
  post: PostView;
  crumb: ReactNode;
  byline: string | null;
  author: ReactNode;
}) {
  const blocks = post.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="mx-auto max-w-[1280px] px-5 pt-[72px] pb-[120px] md:px-10">
      <div className="mx-auto max-w-[760px]">
        <nav className="mb-7 flex flex-wrap gap-2.5 text-sm text-muted-foreground">{crumb}</nav>
        <h1 className="text-[clamp(34px,4.4vw,56px)] font-bold leading-[1.06] tracking-[-0.03em] text-balance">{post.title}</h1>
        {byline ? <p className="mt-[18px] text-muted-foreground">{byline}</p> : null}
        {post.cover ? (
          <div className="my-10 aspect-[16/9] overflow-hidden bg-muted">
            <img src={post.cover} alt={post.coverAlt} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-10" />
        )}
        {blocks.map((b, i) =>
          b.startsWith("## ") ? (
            <h2 key={i} className="mt-12 mb-3.5 text-[28px] font-bold leading-[1.2] tracking-[-0.01em]">{b.slice(3)}</h2>
          ) : (
            <p key={i} className="mt-[18px] text-[18px] leading-[1.75] whitespace-pre-line first:mt-0">{b}</p>
          ),
        )}
        {author}
      </div>
    </article>
  );
}
