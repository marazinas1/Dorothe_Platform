import { Reveal } from "@/components/shared/Reveal";

import { credItems, type HomeTemplateProps } from "../types";

/**
 * Qualification as three columns separated by hairlines: an argument set out on
 * paper rather than badges on a wall. The certification line under each column
 * carries the accent, so the evidence is what catches the eye.
 */
export function H2Credentials({ copy }: HomeTemplateProps) {
  const intro = copy.text("cred_intro");
  const items = credItems(copy);
  if (!intro && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-8 lg:py-24">
      {intro ? (
        <p className="max-w-[52ch] text-lg leading-[1.68] text-muted-foreground">{intro}</p>
      ) : null}

      {items.length > 0 ? (
        <div className="mt-14 grid border-t border-border md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 90}
              className="border-b border-border py-8 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/60 text-xs tabular-figures">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 font-heading text-xl">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
              {item.tag ? (
                <div className="mt-4 text-[12.5px] font-medium text-accent">{item.tag}</div>
              ) : null}
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}
