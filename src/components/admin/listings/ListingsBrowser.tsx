import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { AdminListingRow } from "@/lib/listings/admin.functions";
import {
  EMPTY_FILTERS,
  LISTING_TABS,
  filterListings,
  inTab,
  type ListingFilters,
} from "@/lib/listings/admin-list-filters";
import { AdminTabButtons } from "@/components/admin/ui/AdminTabButtons";
import { ListingsToolbar } from "./ListingsToolbar";
import { ListingsTable } from "./ListingsTable";

/** Status tabs, filters and the listings table. */
export function ListingsBrowser({ rows, locale }: { rows: AdminListingRow[]; locale: string }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_FILTERS);

  const filtered = useMemo(() => filterListings(rows, filters, locale), [rows, filters, locale]);
  const visible = filtered.filter((r) => inTab(r, filters.tab));

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto border-b border-border">
        <AdminTabButtons
          label={t("admin.listings.tabs.label")}
          value={filters.tab}
          onChange={(tab) => setFilters({ ...filters, tab })}
          items={LISTING_TABS.map((id) => ({
            id,
            label: (
              <>
                {t(`admin.listings.tabs.${id}`)}
                <span className="ml-1.5 tabular-nums">
                  {rows.filter((r) => inTab(r, id)).length}
                </span>
              </>
            ),
          }))}
        />
      </div>
      <ListingsToolbar filters={filters} onChange={setFilters} count={visible.length} />
      <ListingsTable rows={visible} locale={locale} />
    </div>
  );
}
