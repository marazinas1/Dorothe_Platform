import { cn } from "@/lib/utils";

import { testiItems, type HomeTemplateProps } from "./types";

/**
 * Client voices — the one trust element a solo practice cannot borrow from a
 * company brand. Shared by every design that shows it: `paper` renders quiet
 * cards on the deeper paper band, `ink` an inverted band with hairline columns.
 */
export function HomeTestimonials({
  copy,
  tone = "paper",
}: HomeTemplateProps & { tone?: "paper" | "ink" }) {
  const items = testiItems(copy);
  if (items.length === 0) return null;
  const title = copy.text("testi_title");

  if (tone === "ink") {
    return (
      <section className="bg-primary py-20 text-primary-foreground lg:py-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
          {title ? <h2 className="text-section max-w-[40ch] text-balance">{title}</h2> : null}
          <div className="mt-12 grid border-t border-primary-foreground/20 md:grid-cols-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="border-b border-primary-foreground/20 py-7 md:border-b-0 md:border-r md:pr-7 md:last:border-r-0"
              >
                <Stars className="text-accent" />
                <p className="mt-4 text-[15px] leading-relaxed opacity-85">{item.quote}</p>
                <div className="mt-5 text-[13px] opacity-60">
                  {[item.name, item.town].filter(Boolean).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-secondary py-20 lg:py-[88px]">
      <div className="mx-auto max-w-[1220px] px-6 lg:px-8">
        {title ? <h2 className="text-section max-w-[40ch] text-balance">{title}</h2> : null}
        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col rounded-[var(--radius)] bg-background px-[26px] py-[30px]"
            >
              <Stars className="text-accent" />
              <p className="mt-4 min-h-[88px] text-[14.5px] leading-[1.62]">{item.quote}</p>
              <div className="mt-[22px] border-t border-border pt-4">
                <div className="text-[13.5px] font-semibold">{item.name}</div>
                {item.town ? (
                  <div className="text-[12.5px] text-muted-foreground">{item.town}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <div className={cn("text-sm tracking-[2px]", className)} aria-hidden>
      ★★★★★
    </div>
  );
}
