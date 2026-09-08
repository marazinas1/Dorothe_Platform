import { Reveal } from "@/components/shared/Reveal";

import { credItems, type HomeTemplateProps } from "../types";

/**
 * Qualification as an editorial table: a lede paragraph, then three columns
 * opened by one heavy rule. The certificate lines carry the amber.
 */
export function H5Credentials({ copy }: HomeTemplateProps) {
  const intro = copy.text("cred_intro");
  const items = credItems(copy);
  if (!intro && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1220px] px-6 pb-20 lg:px-8">
      {intro ? (
        <p className="mb-12 max-w-[60ch] text-lg leading-[1.65] text-muted-foreground">{intro}</p>
      ) : null}
      {items.length > 0 ? (
        <div className="grid border-t-2 border-foreground md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 90}
              className="border-b border-border py-6 md:border-b-0 md:border-r md:pr-6 md:last:border-r-0"
            >
              <h3 className="font-heading text-lg">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              {item.tag ? (
                <div className="mt-3.5 text-[12.5px] font-semibold text-accent">{item.tag}</div>
              ) : null}
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}
