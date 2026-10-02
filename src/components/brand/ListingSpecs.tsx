import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import type { PublicListing } from "@/lib/listings/queries.functions";
import { specGroups } from "@/lib/listings/spec-groups";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  listing: PublicListing;
  locale: Locale;
  settings: SiteSettings;
};

/**
 * The full specification, grouped into size, building, costs and terms. Which
 * rows exist is decided in src/lib/listings/spec-groups.ts — this component
 * contains no deal-type or property-type test of its own.
 */
export function ListingSpecs({ listing, locale, settings }: Props) {
  const { t } = useTranslation();
  const groups = specGroups(listing, settings, locale, t);
  const costs = groups.find((group) => group.titleKey === "listings.detail.sections.costs");
  if (!costs) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
        {t(costs.titleKey)}
      </h2>
      <dl className="mt-7 max-w-2xl">
        {costs.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-border py-4">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="tabular-figures text-right text-sm font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
