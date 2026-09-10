import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";

import { ListingCardSpecs } from "@/components/brand/ListingCardSpecs";
import { pickLocalized, formatPrice } from "@/lib/listings/format";
import type { AdminListingRow } from "@/lib/listings/admin.functions";
import type { Locale } from "@/i18n/config";
import { statusTone, TONE_DOT_CLASS } from "@/lib/listings/status-options";
import { statusLabelKey } from "@/lib/listings/status-label";
import { variantUrl } from "./listing-image-url";
import { ListingStatusSelect } from "./ListingStatusSelect";
import { ListingCardActions } from "./ListingCardActions";

function coverUrl(row: AdminListingRow): string | null {
  const sorted = [...(row.images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const primary = sorted.find((i) => i.is_primary) ?? sorted[0];
  return primary ? variantUrl(primary.variants, "card") : null;
}

/**
 * The admin tile speaks the same visual language as the public card: 3:2
 * photograph, eyebrow row, the shared icon figures, then the price — plus the
 * management row the public site does not have.
 */
export function ListingCardTile({
  row,
  locale,
  currency,
}: {
  row: AdminListingRow;
  locale: string;
  currency: string;
}) {
  const { t } = useTranslation();
  const cover = coverUrl(row);
  const tone = statusTone(row.status);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-media border border-border bg-card">
      <Link
        to="/$locale/admin/listings/$id"
        params={{ locale, id: row.id }}
        className="group relative block aspect-[3/2] overflow-hidden bg-muted"
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground/70">
            <ImageOff className="h-5 w-5" />
            <span className="text-[11px]">{t("admin.listings.noImages")}</span>
          </span>
        )}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-media bg-background/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-foreground backdrop-blur-sm">
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${TONE_DOT_CLASS[tone]}`} />
          {t(statusLabelKey(row.status, row.deal_type))}
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="eyebrow truncate text-muted-foreground">{row.address_city}</span>
          <span className="eyebrow shrink-0 text-muted-foreground">
            {t(`listings.dealType.${row.deal_type}`)}
          </span>
        </div>

        <div className="mt-3">
          <ListingCardSpecs listing={row} areaUnit="sqm" locale={locale as Locale} />
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[2.5em] font-heading text-lg leading-tight">
          <Link
            to="/$locale/admin/listings/$id"
            params={{ locale, id: row.id }}
            className="underline-offset-4 hover:underline"
          >
            {pickLocalized(row.title, locale) || t("admin.listings.untitled")}
          </Link>
        </h3>

        <p className="mt-2 text-xs text-muted-foreground">
          {t(`listings.propertyType.${row.property_type}`)}
          {row.reference_code
            ? ` · ${t("listings.detail.reference_short")} ${row.reference_code}`
            : ""}
        </p>

        <p className="mt-3 text-sm tabular-figures">
          {formatPrice(row.price, currency, locale as Locale, {
            onRequest: row.price_on_request,
            onRequestLabel: t("listings.on_request"),
          })}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <ListingStatusSelect row={row} />
          <ListingCardActions
            id={row.id}
            slug={row.slug}
            locale={locale}
            status={row.status}
            dealType={row.deal_type}
          />
        </div>
      </div>
    </article>
  );
}
