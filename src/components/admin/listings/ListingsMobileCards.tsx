import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ImageOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { AdminListingRow } from "@/lib/listings/admin.functions";
import { formatPrice, pickLocalized } from "@/lib/listings/format";
import { ListingStatusBadge, PlainBadge } from "./ListingBadges";
import { ListingCardActions } from "./ListingCardActions";
import { primaryThumb } from "./listing-image-url";

export function ListingsMobileCards({ rows, locale, currency, canReorder, savingOrder, onMoveStep }: {
  rows: AdminListingRow[];
  locale: string;
  currency: string;
  canReorder: boolean;
  savingOrder: boolean;
  onMoveStep: (id: string, direction: -1 | 1) => void;
}) {
  const { t } = useTranslation();

  return (
    <ul className="grid min-w-0 gap-3 md:hidden">
      {rows.map((row, index) => {
        const title = pickLocalized(row.title, locale) || t("admin.listings.untitled");
        const thumb = primaryThumb(row);
        return (
          <li key={row.id} className="min-w-0 rounded-[var(--radius)] border border-border bg-card p-4">
            <Link to="/admin/listings/$id" params={{ id: row.id }} className="grid min-w-0 grid-cols-[96px_minmax(0,1fr)] items-start gap-3 rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] bg-secondary">
                {thumb ? <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ImageOff aria-hidden className="size-5 text-muted-foreground" strokeWidth={1.75} />}
              </span>
              <span className="min-w-0 space-y-1">
                <span className="block break-words text-sm font-semibold leading-5">{title}</span>
                {row.address_city ? <span className="block break-words text-xs text-muted-foreground">{row.address_city}</span> : null}
                {row.reference_code ? <span className="block break-words text-xs text-muted-foreground">{t("admin.listings.table.ref")} {row.reference_code}</span> : null}
              </span>
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ListingStatusBadge status={row.status} />
              {row.price_reduced ? <PlainBadge>{t("admin.listings.table.priceReduced")}</PlainBadge> : null}
            </div>
            <p className="mt-3 break-words text-base font-semibold tabular-nums">
              {formatPrice(row.price, currency, locale as Locale, { onRequest: row.price_on_request, onRequestLabel: t("listings.on_request") })}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 [&_button]:min-h-10 [&_button]:min-w-10">
              <ListingCardActions id={row.id} slug={row.slug} locale={locale} status={row.status} dealType={row.deal_type} />
              {canReorder ? (
                <div className="flex shrink-0 gap-1" role="group" aria-label={`${t("admin.listings.table.order")}: ${title}`}>
                  {([-1, 1] as const).map((direction) => {
                    const label = direction === -1 ? t("admin.testimonials.moveUp") : t("admin.testimonials.moveDown");
                    const Icon = direction === -1 ? ArrowUp : ArrowDown;
                    return <Button key={direction} type="button" variant="ghost" size="icon" aria-label={label} title={label} disabled={savingOrder || (direction === -1 ? index === 0 : index === rows.length - 1)} onClick={() => onMoveStep(row.id, direction)}><Icon className="size-4" strokeWidth={1.75} /></Button>;
                  })}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}