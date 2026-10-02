import { ListingCard } from "@/components/brand/ListingCard";
import type { Locale } from "@/i18n/config";
import type { PublicListing } from "@/lib/listings/queries.functions";
import type { SiteSettings } from "@/types/site-settings";
import { useTranslation } from "react-i18next";

import { HomeTextLink } from "./HomeActions";

type Props = {
  locale: Locale;
  settings: SiteSettings;
  items: PublicListing[];
  title: string;
  note?: string;
  hidePrice?: boolean;
};

/**
 * The property block, shared by every home design: the card itself must stay one
 * component so specs, carousel and sold masking can never drift apart. A design
 * only chooses how its head reads — never how a property is presented.
 */
export function HomeListings({ locale, settings, items, title, note, hidePrice = false }: Props) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-[88px] md:px-10 lg:pb-[96px]">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-section max-w-[24ch] text-balance">{title}</h2>
          {note ? (
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
              {note}
            </p>
          ) : null}
        </div>
        <HomeTextLink locale={locale} to="/$locale/immobilien" className="shrink-0">
          {t("home.view_all")} →
        </HomeTextLink>
      </div>

      <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((l, i) => (
          <div key={l.id} className="h-full">
            <ListingCard
              listing={l}
              locale={locale}
              settings={settings}
              hidePrice={hidePrice}
              eager={i === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
