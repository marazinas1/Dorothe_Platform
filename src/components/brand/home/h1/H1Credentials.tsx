import { credItems, type HomeTemplateProps } from "../types";

/**
 * Qualification as an argument set out on paper: one paragraph in her own voice,
 * then three hairline columns. The certificate line under each column carries
 * the amber, so the evidence is what the eye lands on.
 */
export function H1Credentials({ copy }: HomeTemplateProps) {
  const intro = copy.text("cred_intro");
  const items = credItems(copy);
  if (!intro && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1220px] border-b border-border px-6 py-20 lg:px-8 lg:py-[88px]">
      {intro ? (
        <p className="max-w-[60ch] text-lg leading-[1.65] text-muted-foreground">{intro}</p>
      ) : null}

      {items.length > 0 ? (
        <div className="mt-14 grid border-t border-border md:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="border-b border-border py-7 md:border-b-0 md:border-r md:pr-7 md:nth-[2]:pl-7 md:last:border-r-0 md:last:pl-7"
            >
              <h3 className="font-heading text-[19px]">{item.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
              {item.tag ? (
                <div className="mt-3.5 text-[12.5px] font-semibold text-accent">{item.tag}</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
