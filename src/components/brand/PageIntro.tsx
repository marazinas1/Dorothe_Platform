import type { ReactNode } from "react";

type Props = {
  kicker: string;
  headline: string;
  lead: string;
  image?: string | null;
  actions?: ReactNode;
};

/**
 * Opening block of a content page: eyebrow, one large statement, one lead
 * paragraph. Uses the shared type tiers so no page invents its own hero size.
 */
export function PageIntro({ kicker, headline, lead, image, actions }: Props) {
  return (
    <section className="border-b border-border bg-card pt-28 pb-16 lg:pt-36 lg:pb-20">
      <div className={`mx-auto grid max-w-[1280px] items-center gap-12 px-5 md:px-10 ${image ? "lg:grid-cols-2" : ""}`}>
        <div>
          <div className="eyebrow text-muted-foreground">{kicker}</div>
          <h1 className="text-section-lg mt-8 max-w-[22ch] text-balance">{headline}</h1>
          <p className="text-lead mt-8 max-w-[58ch] text-muted-foreground">{lead}</p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {image ? <img src={image} alt="" width={1408} height={1056} className="aspect-[4/3] w-full rounded-media object-cover" /> : null}
      </div>
    </section>
  );
}
