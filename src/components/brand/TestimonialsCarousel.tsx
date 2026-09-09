import { Stars } from "@/components/brand/home/HomeTestimonials";
import type { TestiItem } from "@/lib/testimonials/types";

/**
 * Every published client voice, as a horizontally swipeable band. CSS-only
 * scroll snapping — no motion library, no client state.
 */
export function TestimonialsCarousel({
  items,
  title,
}: {
  items: TestiItem[];
  title?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="bg-secondary py-16 lg:py-20">
      <div className="mx-auto max-w-[1220px] px-6 lg:px-8">
        {title ? <h2 className="text-section max-w-[40ch] text-balance">{title}</h2> : null}
        <ul className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex min-w-[280px] max-w-[360px] flex-1 shrink-0 snap-start flex-col rounded-[var(--radius)] bg-background px-[26px] py-[30px]"
            >
              <Stars className="text-accent" />
              <p className="mt-4 text-[14.5px] leading-[1.62]">{item.quote}</p>
              <div className="mt-auto pt-[22px]">
                <div className="border-t border-border pt-4 text-[13.5px] font-semibold">
                  {item.name}
                </div>
                {item.town ? (
                  <div className="text-[12.5px] text-muted-foreground">{item.town}</div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
