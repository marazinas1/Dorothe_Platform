import { CardRail } from "@/components/brand/CardRail";
import { ListingCard } from "@/components/brand/ListingCard";
import { Reveal } from "@/components/shared/Reveal";
import type { Locale } from "@/i18n/config";
import { SECTION_GAP } from "@/lib/homepage/rhythm";
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
    <section className={`mx-auto ${SECTION_GAP.normal} max-w-[1400px] px-6 lg:px-10`}>
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

      <CardRail perView={3} label={title}>
        {items.map((l, i) => (
          <Reveal key={l.id} delay={Math.min(i, 2) * 90} className="h-full">
            <ListingCard
              listing={l}
              locale={locale}
              settings={settings}
              hidePrice={hidePrice}
              eager={i === 0}
            />
          </Reveal>
        ))}
      </CardRail>
    </section>
  );
}
