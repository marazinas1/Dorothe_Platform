import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { adminListingsQueryOptions, type AdminListingRow } from "@/lib/listings/admin.functions";
import { reorderAdminListings } from "@/lib/listings/admin-order.functions";
import {
  EMPTY_FILTERS,
  LISTING_TABS,
  filterListings,
  inTab,
  sortListings,
  type ListingFilters,
} from "@/lib/listings/admin-list-filters";
import { AdminTabButtons } from "@/components/admin/ui/AdminTabButtons";
import { ListingsToolbar } from "./ListingsToolbar";
import { ListingsTable } from "./ListingsTable";

/** Status tabs, filters and the listings table. */
export function ListingsBrowser({ rows, locale }: { rows: AdminListingRow[]; locale: string }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_FILTERS);
  const [orderedRows, setOrderedRows] = useState(() => sortListings(rows));
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => setOrderedRows(sortListings(rows)), [rows]);

  const filtered = useMemo(() => filterListings(orderedRows, filters, locale), [orderedRows, filters, locale]);
  const visible = filtered.filter((r) => inTab(r, filters.tab));
  const canReorder =
    filters.tab === "all" &&
    filters.dealType === "all" &&
    filters.propertyType === "all" &&
    filters.search.trim().length === 0;

  async function persist(next: AdminListingRow[]) {
    const ranked = next.map((row, index) => ({ ...row, sort_order: (index + 1) * 10 }));
    setOrderedRows(ranked);
    setSavingOrder(true);
    try {
      await reorderAdminListings({ data: { order: ranked.map((row) => row.id) } });
      await queryClient.invalidateQueries({ queryKey: adminListingsQueryOptions.queryKey });
      toast.success(t("admin.listings.orderSaved"));
    } catch (error) {
      setOrderedRows(sortListings(rows));
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setSavingOrder(false);
    }
  }

  function moveTo(sourceId: string, targetId: string) {
    if (!canReorder || sourceId === targetId) return;
    const next = [...orderedRows];
    const from = next.findIndex((row) => row.id === sourceId);
    const to = next.findIndex((row) => row.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    void persist(next);
  }

  function moveStep(id: string, direction: -1 | 1) {
    if (!canReorder) return;
    const index = orderedRows.findIndex((row) => row.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= orderedRows.length) return;
    const next = [...orderedRows];
    const [moved] = next.splice(index, 1);
    if (!moved) return;
    next.splice(target, 0, moved);
    void persist(next);
  }

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
      <ListingsTable
        rows={visible}
        locale={locale}
        canReorder={canReorder}
        savingOrder={savingOrder}
        onMoveTo={moveTo}
        onMoveStep={moveStep}
      />
    </div>
  );
}
