import type { PostView } from "@/lib/posts/types";

/**
 * One article. The body is plain text with blank-line paragraphs, so an owner
 * writes as she would in an e-mail and never touches markup.
 */
export function PostArticle({
  post,
  dateLabel,
  backSlot,
}: {
  post: PostView;
  dateLabel: string | null;
  backSlot?: React.ReactNode;
}) {
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="py-16 lg:py-20">
      <div className="mx-auto max-w-[760px] px-6 lg:px-8">
        {dateLabel ? (
          <div className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
            {dateLabel}
          </div>
        ) : null}
        <h1 className="mt-4 text-section text-balance">{post.title}</h1>
        {post.excerpt ? (
          <p className="mt-5 text-[16.5px] leading-[1.7] text-muted-foreground">{post.excerpt}</p>
        ) : null}

        {post.cover ? (
          <div className="mt-10 aspect-[16/9] w-full overflow-hidden bg-muted">
            <img src={post.cover} alt={post.coverAlt} className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div className="mt-10 space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[16px] leading-[1.75] whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        {backSlot ? <div className="mt-14">{backSlot}</div> : null}
      </div>
    </article>
  );
}
