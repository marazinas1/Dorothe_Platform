import { useTranslation } from "react-i18next";

import { ListingIcon } from "@/components/brand/ui/ListingIcon";
import type { Locale } from "@/i18n/config";
import { cardSpecs, type CardSpecIcon } from "@/lib/listings/card-specs";
import { cn } from "@/lib/utils";

type Props = {
  listing: Parameters<typeof cardSpecs>[0];
  areaUnit: "sqm" | "sqft";
  locale: Locale;
  /** Smaller text for dense proof blocks. */
  compact?: boolean;
};

const ICONS: Record<CardSpecIcon, Parameters<typeof ListingIcon>[0]["name"]> = {
  area: "area",
  rooms: "rooms",
  plot: "plot",
  floor: "floor",
  year: "year",
};

/**
 * Icon + value + word, the one fact row. The energy class is not here: it
 * sits in the price row as a legal disclosure (see ListingCard).
 */
export function ListingCardSpecs({ listing, areaUnit, locale, compact = false }: Props) {
  const { t } = useTranslation();
  const { specs } = cardSpecs(listing, areaUnit, locale);

  return (
    <ul
      className={cn(
        "flex min-h-[1.75rem] flex-wrap items-center gap-x-[18px] gap-y-1.5 text-sm text-muted-foreground",
        compact && "min-h-[1.25rem] gap-x-3 text-xs",
      )}
    >
      {specs.map((spec) => (
        <li key={spec.key} className="inline-flex items-center gap-1.5">
          <ListingIcon name={ICONS[spec.key]} className={compact ? "size-3.5" : "size-4"} />
          <span className="tabular-figures">
            {spec.value}
            {spec.key === "rooms" ? ` ${t("listings.facts.rooms")}` : ""}
            {spec.key === "floor" ? `. ${t("listings.facts.floor")}` : ""}
          </span>
          <span className="sr-only">{t(spec.labelKey)}</span>
        </li>
      ))}
    </ul>
  );
}
