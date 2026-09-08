import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import { SOLD_CARD_GRID } from "@/lib/homepage/card-grid";
import { SECTION_GAP } from "@/lib/homepage/rhythm";
import type { PublicListing } from "@/lib/listings/queries.functions";
import type { SiteSettings } from "@/types/site-settings";

import { Reveal } from "@/components/shared/Reveal";

import { ListingCard } from "./ListingCard";

type Props = {
  locale: Locale;
  items: PublicListing[];
  settings: SiteSettings;
  /** Achieved prices stay hidden unless the client opts in. */
  hidePrice?: boolean;
};

/**
 * Sold properties as credibility proof. Same card as everywhere else — the
 * archive reading (muted photograph, sold marker, no asking price) comes from
 * the listing's own status, not from a second component. Rendered in a
 * two-column, smaller-card layout so it visually steps back from the active
 * listings above.
 */
export function SoldStrip({ locale, items, settings, hidePrice = false }: Props) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <section className={`mx-auto ${SECTION_GAP.tight} max-w-[1400px] px-6 lg:px-10`}>
      <div className="mb-12 max-w-2xl">
        <h2 className="text-section-sm">{t("home.recent_sales")}</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {t("home.recent_sales_intro")}
        </p>
      </div>

      <div className={SOLD_CARD_GRID}>
        {items.slice(0, 2).map((l, i) => (
          <Reveal key={l.id} delay={i * 90} className="h-full">
            <ListingCard
              listing={l}
              locale={locale}
              settings={settings}
              size="small"
              hidePrice={hidePrice}
            />
          </Reveal>
        ))}
      </div>

      <div className="mt-12">
        <Link
          to="/$locale/verkauft"
          params={{ locale }}
          className="eyebrow text-muted-foreground transition-opacity duration-300 hover:text-foreground"
        >
          {t("home.view_all_sold")} →
        </Link>
      </div>
    </section>
  );
}

