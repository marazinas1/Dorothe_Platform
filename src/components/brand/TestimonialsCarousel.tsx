import { Stars } from "@/components/brand/home/HomeTestimonials";
import type { TestiItem } from "@/lib/testimonials/types";

/**
 * Every published client voice, as a calm grid (three per row on desktop).
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
    <section className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        {title ? <h2 className="text-section max-w-[40ch] text-balance">{title}</h2> : null}
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex flex-col rounded-[var(--radius)] bg-background px-[26px] py-[30px]"
            >
              <Stars className="text-foreground" />
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
