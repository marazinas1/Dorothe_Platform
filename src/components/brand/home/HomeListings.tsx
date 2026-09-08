import { useTranslation } from "react-i18next";

import { ListingCard } from "@/components/brand/ListingCard";
import { Reveal } from "@/components/shared/Reveal";
import type { Locale } from "@/i18n/config";
import { LISTING_CARD_GRID } from "@/lib/homepage/card-grid";
import { SECTION_GAP } from "@/lib/homepage/rhythm";
import type { PublicListing } from "@/lib/listings/queries.functions";
import type { SiteSettings } from "@/types/site-settings";

import { HomeTextLink } from "./HomeActions";

type Props = {
  locale: Locale;
  settings: SiteSettings;
  items: PublicListing[];
  title: string;
  note?: string;
  /** `feature` gives the first property the full width, the rest a row. */
  variant?: "grid" | "feature";
  hidePrice?: boolean;
};

/**
 * The property block, shared by all designs: the card itself must stay one
 * component so specs, carousel and sold masking can never drift apart. A
 * design only chooses how the block is arranged and how its head reads.
 */
export function HomeListings({
  locale,
  settings,
  items,
  title,
  note,
  variant = "grid",
  hidePrice = false,
}: Props) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  const [lead, ...rest] = items;

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

      {variant === "feature" ? (
        <div className="space-y-8">
          <Reveal>
            <ListingCard
              listing={lead}
              locale={locale}
              settings={settings}
              hidePrice={hidePrice}
              eager
            />
          </Reveal>
          {rest.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {rest.map((l, i) => (
                <Reveal key={l.id} delay={i * 90} className="h-full">
                  <ListingCard
                    listing={l}
                    locale={locale}
                    settings={settings}
                    size="compact"
                    hidePrice={hidePrice}
                  />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className={LISTING_CARD_GRID}>
          {items.map((l, i) => (
            <Reveal key={l.id} delay={i * 90} className="h-full">
              <ListingCard
                listing={l}
                locale={locale}
                settings={settings}
                hidePrice={hidePrice}
                eager={i === 0}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
