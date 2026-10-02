import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import type { PublicListing } from "@/lib/listings/queries.functions";
import type { SiteSettings } from "@/types/site-settings";

import { HomeTextLink } from "./home/HomeActions";
import { ListingCard } from "./ListingCard";

type Props = {
  locale: Locale;
  items: PublicListing[];
  settings: SiteSettings;
  /** Achieved prices stay hidden unless the client opts in. */
  hidePrice?: boolean;
};

/**
 * Sold properties as credibility proof. Structurally identical to the available
 * properties block above — same head layout, same archive link position, same
 * card, three at a time — so a property that changes status simply moves from
 * one rail to the other without changing how it is presented.
 */
export function SoldStrip({ locale, items, settings, hidePrice = false }: Props) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  const title = t("home.recent_sales");

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-[72px] md:px-10 lg:py-[120px]">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-section max-w-[24ch] text-balance">{title}</h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
            {t("home.recent_sales_intro")}
          </p>
        </div>
        <HomeTextLink locale={locale} to="/$locale/verkauft" className="shrink-0">
          {t("home.view_all_sold")} →
        </HomeTextLink>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {items.slice(0, 4).map((l) => (
          <div key={l.id} className="h-full">
            <ListingCard
              listing={l}
              locale={locale}
              settings={settings}
              hidePrice={hidePrice}
              size="small"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
