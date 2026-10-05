import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";
import type { PublicListing } from "@/lib/listings/queries.functions";
import { formatPrice } from "@/lib/listings/format";
import { commissionRow } from "@/lib/listings/commission";
import type { SiteSettings } from "@/types/site-settings";
import { actionButtonClass } from "@/components/brand/ui/ActionButton";
import { buttonClass } from "@/components/brand/ui/Button";
import { ListingIcon } from "@/components/brand/ui/ListingIcon";
import { agentPortraitIfSet } from "@/lib/media/slots";

type Props = {
  listing: PublicListing;
  locale: Locale;
  settings: SiteSettings;
  /** Anchor of the enquiry form. */
  contactHref: string;
};

/**
 * Desktop-only aside: the price, the two or three figures a buyer checks
 * against it, and the way to ask. It stays with the reader through the long
 * middle of the page and is released once the enquiry form is on screen.
 */
export function ListingStickyRail({ listing, locale, settings, contactHref }: Props) {
  const { t } = useTranslation();
  const price = formatPrice(listing.price, settings.currency, locale, {
    onRequest: listing.price_on_request,
    period: listing.price_period,
    onRequestLabel: t("listings.on_request"),
  });
  const commission = commissionRow(listing, settings.currency, locale, t);
  const agentName = settings.primary_agent_name ?? settings.legal_name ?? settings.site_name;
  const agentPhoto = agentPortraitIfSet(settings);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 border border-border p-7">
        <div className="font-heading text-3xl font-bold leading-none tabular-figures">
          {price}
        </div>

        {commission ? (
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {t(commission.labelKey)}: {commission.value}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
          {agentPhoto ? (
            <img
              src={agentPhoto}
              alt={agentName}
              className="size-14 flex-none object-cover grayscale"
            />
          ) : null}
          <div className="min-w-0">
            <div className="font-semibold">{agentName}</div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{settings.primary_agent_role}</p>
          </div>
        </div>

        <a
          href={contactHref}
          className={actionButtonClass("primary", "mt-8 w-full")}
        >
          <ListingIcon name="cal" /> {t("listings.detail.book_viewing")}
        </a>
        <a href={contactHref} className={buttonClass({ variant: "secondary", className: "mt-2 w-full" })}>
          <ListingIcon name="doc" /> {t("listings.detail.request_expose")}
        </a>
        {settings.contact_phone ? <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold"><ListingIcon name="phone" />{settings.contact_phone}</a> : null}
        {listing.reference_code ? (
          <div className="mt-4 text-center text-xs text-muted-foreground">
            {t("listings.detail.reference_short")} {listing.reference_code}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
