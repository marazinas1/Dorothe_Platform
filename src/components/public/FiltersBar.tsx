import { useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/brand/ui/Button";
import { ListingIcon } from "@/components/brand/ui/ListingIcon";
import type { Locale } from "@/i18n/config";
import type { ListingsSearch } from "@/lib/listings/search-schema";
import { cn } from "@/lib/utils";

type Props = { locale: Locale; search: ListingsSearch; total: number };

const PRICE = { sale: [150_000, 250_000, 350_000, 500_000, 750_000, 1_000_000], rent: [500, 750, 1000, 1500, 2000] };
const ROOMS = [1, 2, 3, 4, 5, 6];
const AREA = [50, 75, 100, 150, 200, 250];

const CTL =
  "flex min-h-11 w-full items-center gap-2 rounded-[var(--radius-button)] border border-border bg-background px-3 text-[14.5px] text-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring";

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label htmlFor={id} className="text-[12.5px] font-semibold text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({ id, value, onChange, children }: { id: string; value: string | number; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <div className={cn(CTL, "relative")}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent pr-6 outline-none"
      >
        {children}
      </select>
      <ListingIcon name="chev" className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
    </div>
  );
}

/** Buy/Rent switch + always-visible filters (broker listings reference). */
export function FiltersBar({ locale, search, total }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/$locale/immobilien/" });
  const [draft, setDraft] = useState(search);
  const deal = search.deal === "rent" ? "rent" : "sale";
  const nf = new Intl.NumberFormat(locale === "en" ? "en-US" : "de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const any = t("listings.filters.any");

  const go = (patch: Partial<ListingsSearch>) =>
    navigate({ params: { locale }, search: (prev: ListingsSearch) => ({ ...prev, ...patch, page: 1 }) });
  const set = (patch: Partial<ListingsSearch>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <div>
      <div role="tablist" className="mt-[22px] inline-flex rounded-[var(--radius-button)] border border-border p-[3px]">
        {(["sale", "rent"] as const).map((d) => (
          <button
            key={d}
            type="button"
            role="tab"
            aria-selected={deal === d}
            onClick={() => go({ deal: d === "sale" ? "" : "rent", price_max: 0 })}
            className={cn(
              "min-h-[38px] cursor-pointer rounded-[var(--radius-button)] px-[18px] text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              deal === d ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`listings.filters.${d}`)}
          </button>
        ))}
      </div>

      <form
        className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          go({ city: draft.city, type: draft.type, price_max: draft.price_max, rooms_min: draft.rooms_min, area_min: draft.area_min });
        }}
      >
        <div className="col-span-2 lg:col-span-1">
          <Field label={t("listings.filters.location")} id="f-city">
            <div className={CTL}>
              <ListingIcon name="search" className="size-4 text-muted-foreground" />
              <input
                id="f-city"
                value={draft.city}
                onChange={(e) => set({ city: e.target.value })}
                placeholder={t("listings.filters.location_placeholder")}
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
          </Field>
        </div>
        <Field label={t("listings.filters.type")} id="f-type">
          <Select id="f-type" value={draft.type} onChange={(v) => set({ type: v })}>
            <option value="">{t("listings.filters.type_any")}</option>
            {["house", "apartment", "land", "commercial"].map((k) => (
              <option key={k} value={k}>{t(`listings.filters.${k}`)}</option>
            ))}
          </Select>
        </Field>
        <Field label={t("listings.filters.price_up_to")} id="f-price">
          <Select id="f-price" value={draft.price_max} onChange={(v) => set({ price_max: Number(v) })}>
            <option value={0}>{any}</option>
            {PRICE[deal].map((n) => <option key={n} value={n}>{nf.format(n)}</option>)}
          </Select>
        </Field>
        <Field label={t("listings.filters.rooms_min")} id="f-rooms">
          <Select id="f-rooms" value={draft.rooms_min} onChange={(v) => set({ rooms_min: Number(v) })}>
            <option value={0}>{any}</option>
            {ROOMS.map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
        </Field>
        <Field label={t("listings.filters.area_from")} id="f-area">
          <Select id="f-area" value={draft.area_min} onChange={(v) => set({ area_min: Number(v) })}>
            <option value={0}>{any}</option>
            {AREA.map((n) => <option key={n} value={n}>{n} m²</option>)}
          </Select>
        </Field>
        <Button type="submit" size="sm" className="col-span-2 self-end lg:col-span-1">
          {t("listings.filters.show", { count: total })}
        </Button>
      </form>
    </div>
  );
}
