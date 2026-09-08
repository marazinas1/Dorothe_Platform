import { factItems, type HomeTemplateProps } from "../types";

/** A thin fact strip under the photograph: three plain claims, hairline-divided. */
export function H5Facts({ copy }: HomeTemplateProps) {
  const facts = factItems(copy);
  if (facts.length === 0) return null;

  return (
    <section className="border-y border-border">
      <div className="mx-auto grid max-w-[1220px] px-6 md:grid-cols-3 lg:px-8">
        {facts.map((fact, i) => (
          <div
            key={i}
            className="border-b border-border py-6 text-center md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div className="font-heading text-[19px]">{fact.value}</div>
            {fact.label ? (
              <div className="mt-1.5 text-[12.5px] text-muted-foreground">{fact.label}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
