import { Reveal } from "@/components/shared/Reveal";

import { credItems, type HomeTemplateProps } from "../types";

/**
 * Qualification as a table: claim, explanation, certificate. The most sober
 * possible presentation, which is the point of this direction.
 */
export function H4Credentials({ copy }: HomeTemplateProps) {
  const items = credItems(copy);
  const title = copy.text("cred_title");
  const intro = copy.text("cred_intro");
  if (items.length === 0 && !intro) return null;

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        {title ? <h2 className="text-section-sm max-w-[20ch]">{title}</h2> : null}
        {intro ? (
          <p className="mt-5 max-w-[62ch] leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}

        <div className="mt-12 border-t border-border">
          {items.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className="grid gap-3 border-b border-border py-7 md:grid-cols-[1fr_1.4fr_0.9fr] md:gap-8"
            >
              <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
              {item.tag ? (
                <div className="text-[13px] font-semibold text-accent md:text-right">
                  {item.tag}
                </div>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
