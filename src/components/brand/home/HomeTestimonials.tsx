import { cn } from "@/lib/utils";
import type { TestiItem } from "@/lib/testimonials/types";
import type { Locale } from "@/i18n/config";
import { HomeTextLink } from "./HomeActions";
import { useTranslation } from "react-i18next";

/**
 * Client voices — the one trust element a solo practice cannot borrow from a
 * company brand. Presentational only: the quotes arrive as props.
 */
export function HomeTestimonials({
  items,
  title,
  locale,
  tone = "paper",
}: {
  items: TestiItem[];
  title?: string;
  locale?: Locale;
  tone?: "paper" | "ink";
}) {
  if (items.length === 0) return null;

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
                <Stars className="text-foreground" />
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
    <section className="bg-background py-[72px] lg:py-[96px]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="flex items-end justify-between gap-6">
          {title ? <h2 className="text-section max-w-[40ch] text-balance">{title}</h2> : null}
          {locale ? <ReviewLink locale={locale} /> : null}
        </div>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          {items.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="flex h-full min-h-[230px] flex-col rounded-[var(--radius)] bg-card px-[26px] py-[30px]"
            >
              <p className="min-h-[88px] text-[17px] leading-[1.5]">“{item.quote.replace(/^['\"]|['\"]$/g, "")}”</p>
              <div className="mt-auto pt-[22px]">
                <div className="border-t border-border pt-4 text-[13.5px] font-semibold">
                  {item.name}
                </div>
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

function ReviewLink({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return <HomeTextLink locale={locale} to="/$locale/ueber-mich">{t("home.more_reviews")}</HomeTextLink>;
}

export function Stars({ className }: { className?: string }) {
  return (
    <div className={cn("text-sm tracking-[2px]", className)} aria-hidden>
      ★★★★★
    </div>
  );
}
