import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GripVertical, ImageOff } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export function ListingsTable({
  rows,
  locale,
  canReorder,
  savingOrder,
  onMoveTo,
  onMoveStep,
}: {
  rows: AdminListingRow[];
  locale: string;
  canReorder: boolean;
  savingOrder: boolean;
  onMoveTo: (sourceId: string, targetId: string) => void;
  onMoveStep: (id: string, direction: -1 | 1) => void;
}) {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const date = new Intl.DateTimeFormat(i18n.language.startsWith("de") ? "de-DE" : "en-GB", { day: "numeric", month: "short" });
  const draggedId = useRef<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={`${TH} w-9`} aria-label={t("admin.listings.table.order")} />
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
              <tr
                key={row.id}
                className="group hover:bg-muted"
                onDragOver={(event) => {
                  if (!canReorder) return;
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const source = event.dataTransfer.getData("text/plain") || draggedId.current;
                  if (source) onMoveTo(source, row.id);
                }}
              >
                <td className={`${TD} w-9 pr-0`}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    draggable={canReorder}
                    disabled={!canReorder || savingOrder}
                    aria-label={t("admin.listings.table.dragHandle", { title })}
                    title={canReorder ? t("admin.listings.table.dragHandle", { title }) : t("admin.listings.orderUnavailable")}
                    className="h-8 w-7 cursor-grab text-muted-foreground active:cursor-grabbing"
                    onDragStart={(event) => {
                      draggedId.current = row.id;
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", row.id);
                    }}
                    onDragEnd={() => {
                      draggedId.current = null;
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowUp") {
                        event.preventDefault();
                        onMoveStep(row.id, -1);
                      }
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        onMoveStep(row.id, 1);
                      }
                    }}
                  >
                    <GripVertical className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                </td>
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
      <p className="sr-only" aria-live="polite">
        {savingOrder ? t("admin.listings.orderSaving") : ""}
      </p>
    </div>
  );
}
