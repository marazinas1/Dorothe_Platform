import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEAL_TYPES, PROPERTY_TYPES } from "@/lib/listings/admin-schema";
import type { ListingFilters } from "@/lib/listings/admin-list-filters";

/** Search, type and deal filters with the result count on the right. */
export function ListingsToolbar({
  filters,
  onChange,
  count,
}: {
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
  count: number;
}) {
  const { t } = useTranslation();
  const set = (patch: Partial<ListingFilters>) => onChange({ ...filters, ...patch });
  const trigger = "h-10 w-auto min-w-[110px] gap-3 bg-card text-[13px] font-semibold";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex min-h-10 min-w-[220px] max-w-[420px] flex-1 items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
        <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder={t("admin.listings.toolbar.searchReference")}
          aria-label={t("admin.listings.toolbar.search")}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <Select value={filters.propertyType} onValueChange={(v) => set({ propertyType: v })}>
        <SelectTrigger className={trigger} aria-label={t("admin.listings.fields.property_type")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("admin.listings.toolbar.allTypes")}</SelectItem>
          {PROPERTY_TYPES.map((p) => (
            <SelectItem key={p} value={p}>
              {t(`listings.propertyType.${p}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.dealType} onValueChange={(v) => set({ dealType: v })}>
        <SelectTrigger className={trigger} aria-label={t("admin.listings.fields.deal_type")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("admin.listings.toolbar.saleAndRent")}</SelectItem>
          {DEAL_TYPES.map((d) => (
            <SelectItem key={d} value={d}>
              {t(`listings.dealType.${d}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="ml-auto text-[13px] text-muted-foreground" aria-live="polite">
        {t("admin.listings.toolbar.count", { count })}
      </span>
    </div>
  );
}
