import { Reveal } from "@/components/shared/Reveal";

import { credItems, type HomeTemplateProps } from "../types";

const NUMERALS = ["I", "II", "III"];

/**
 * Qualification as a dark band with roman numerals: the page's one moment of
 * weight between two light sections, so the credentials read as a statement
 * rather than a list of badges.
 */
export function H3Credentials({ copy }: HomeTemplateProps) {
  const intro = copy.text("cred_intro");
  const items = credItems(copy);
  if (!intro && items.length === 0) return null;

  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-24">
      <div className="mx-auto max-w-[1220px] px-6 lg:px-8">
        {intro ? (
          <p className="mb-14 max-w-[56ch] text-lg leading-[1.65] opacity-80">{intro}</p>
        ) : null}
        <div className="grid border-t border-primary-foreground/20 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 90}
              className="border-b border-primary-foreground/20 py-8 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0"
            >
              <span className="block font-heading text-2xl italic text-accent">
                {NUMERALS[i] ?? i + 1}
              </span>
              <h3 className="mt-4 font-heading text-lg italic">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-75">{item.body}</p>
              {item.tag ? <div className="mt-3 text-[12.5px] opacity-70">{item.tag}</div> : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
