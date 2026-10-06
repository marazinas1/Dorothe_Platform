import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";

import { pickLocalized, formatPrice } from "@/lib/listings/format";
import type { AdminListingRow } from "@/lib/listings/admin.functions";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import type { Locale } from "@/i18n/config";
import { variantUrl } from "./listing-image-url";
import { ListingCardActions } from "./ListingCardActions";
import { EnergyChip, ListingStatusBadge, PlainBadge } from "./ListingBadges";

function primaryThumb(row: AdminListingRow): string | null {
  const sorted = [...(row.images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const primary = sorted.find((i) => i.is_primary) ?? sorted[0];
  return primary ? variantUrl(primary.variants, "card") : null;
}

const TH =
  "whitespace-nowrap border-b border-border px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";
const TD = "border-b border-border px-3.5 py-3 align-middle group-last:border-b-0";

export function ListingsTable({ rows, locale }: { rows: AdminListingRow[]; locale: string }) {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const date = new Intl.DateTimeFormat(i18n.language.startsWith("de") ? "de-DE" : "en-GB", { day: "numeric", month: "short" });

  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={TH}>{t("admin.listings.table.property")}</th>
            <th className={TH}>{t("admin.listings.fields.status")}</th>
            <th className={`${TH} text-right`}>{t("admin.listings.fields.price")}</th>
            <th className={TH}>{t("admin.listings.table.energy")}</th>
            <th className={TH}>{t("admin.listings.table.updated")}</th>
            <th className={`${TH} text-right`}>{t("admin.listings.actions.header")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const thumb = primaryThumb(row);
            const title = pickLocalized(row.title, locale) || t("admin.listings.untitled");
            const meta = [
              row.address_city,
              row.reference_code ? `${t("admin.listings.table.ref")} ${row.reference_code}` : null,
            ].filter(Boolean);
            return (
              <tr key={row.id} className="group hover:bg-muted">
                <td className={TD}>
                  <Link to="/admin/listings/$id" params={{ id: row.id }} className="flex items-center gap-3">
                    <span className="block h-12 w-16 shrink-0 overflow-hidden rounded-[var(--radius)] bg-secondary">
                      {thumb ? (
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </span>
                      )}
                    </span>
                    <span>
                      <b className="block font-semibold">{title}</b>
                      <span className="text-[12.5px] text-muted-foreground">{meta.join(", ")}</span>
                    </span>
                  </Link>
                </td>
                <td className={TD}>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <ListingStatusBadge status={row.status} />
                    {row.price_reduced ? <PlainBadge>{t("admin.listings.table.priceReduced")}</PlainBadge> : null}
                  </span>
                </td>
                <td className={`${TD} whitespace-nowrap text-right tabular-nums ${row.price == null || row.price_on_request ? "text-muted-foreground" : ""}`}>
                  {formatPrice(row.price, settings.currency, locale as Locale, {
                    onRequest: row.price_on_request,
                    onRequestLabel: t("listings.on_request"),
                  })}
                </td>
                <td className={TD}>
                  <EnergyChip energy={row.energy} exempt={Boolean(row.energy_exemption)} />
                </td>
                <td className={`${TD} whitespace-nowrap tabular-nums text-muted-foreground`}>
                  {date.format(new Date(row.updated_at))}
                </td>
                <td className={`${TD} text-right`}>
                  <div className="flex justify-end">
                    <ListingCardActions id={row.id} slug={row.slug} locale={locale} status={row.status} dealType={row.deal_type} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">{t("admin.listings.empty")}</p>
      ) : null}
    </div>
  );
}
