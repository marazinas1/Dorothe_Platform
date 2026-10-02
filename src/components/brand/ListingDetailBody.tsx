import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

import { ShareButtons } from "@/components/public/ShareButtons";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import type { Locale } from "@/i18n/config";
import {
  listingDocumentsQueryOptions,
  relatedCandidatesQueryOptions,
  type PublicListing,
} from "@/lib/listings/queries.functions";
import { selectRelated } from "@/lib/listings/related";
import type { SiteSettings } from "@/types/site-settings";

import { EnergyPanel } from "./EnergyPanel";
import { ListingActionBar } from "./ListingActionBar";
import { ListingAgent } from "./ListingAgent";
import { ListingContentSections } from "./ListingContentSections";
import { ListingDocuments } from "./ListingDocuments";
import { ListingFactsBar } from "./ListingFactsBar";
import { ListingFeatures } from "./ListingFeatures";
import { ListingFloorPlans } from "./ListingFloorPlans";
import { ListingGallery } from "./ListingGallery";
import { ListingHeadline } from "./ListingHeadline";
import { ListingHeroOverlay } from "./ListingHeroOverlay";
import { ListingLocationMap } from "./ListingLocationMap";
import { ListingSpecs } from "./ListingSpecs";
import { ListingStickyRail } from "./ListingStickyRail";
import { RelatedListings } from "./RelatedListings";

type Props = {
  listing: PublicListing;
  locale: Locale;
  settings: SiteSettings;
  shareUrl: string;
  title: string;
};

const CONTACT_ID = "kontakt";
const GAP = "mt-16 lg:mt-20";

/**
 * The detail page in reading order: what it looks like, what it costs, what it
 * is, where it is, what the certificate says, then how to ask. Each block hides
 * itself when it has nothing to say, so a sparse listing has no empty headings.
 */
export function ListingDetailBody({ listing, locale, settings, shareUrl, title }: Props) {
  const { t } = useTranslation();
  const l = listing;

  const related = useSuspenseQuery(
    relatedCandidatesQueryOptions({ dealType: l.deal_type, city: l.address_city }),
  );
  const relatedItems = selectRelated(l, related.data.items);

  // The documents feature has no admin UI yet, so while the flag is off the
  // site's busiest page runs no query for it at all.
  const documentsEnabled = useFeatureFlag("listing_documents");
  const documents = useSuspenseQuery(
    listingDocumentsQueryOptions(l.id, documentsEnabled),
  );

  const locationLine =
    l.geo_precision === "hidden"
      ? [l.address_zip, l.address_city].filter(Boolean).join(" ")
      : [l.address_street, l.address_zip, l.address_city].filter(Boolean).join(" · ");

  return (
    <>
      {/* 1. Gallery */}
      <section className="mx-auto max-w-[1080px] px-6 pt-8 lg:px-8">
        <nav aria-label={t("listings.detail.breadcrumb")} className="mb-7 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/$locale/immobilien" params={{ locale }}>{t("admin.nav.properties")}</Link>
          <span aria-hidden>/</span><span>{l.address_city}</span><span aria-hidden>/</span>
          <span className="truncate text-foreground">{title}</span>
        </nav>
        <ListingGallery
          images={l.images}
          locale={locale}
          title={title}
        />
      </section>

      <div className="mx-auto mt-12 grid max-w-[1080px] gap-x-14 px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div className="min-w-0">
          <ListingHeroOverlay
            title={title}
            locationLine={locationLine}
            kicker={`${t(`listings.propertyType.${l.property_type}`)} ${t(l.deal_type === "rent" ? "listings.for_rent" : "listings.for_sale")} · ${t("listings.detail.reference_short")} ${l.reference_code ?? "—"}`}
          />
          {/* 2. Key facts */}
          <section className="mt-10 lg:mt-12">
            <ListingFactsBar listing={l} locale={locale} settings={settings} />
          </section>

          {/* 3. Description, with the highlights that belong to it */}
          <section className={GAP}>
            <ListingHeadline listing={l} locale={locale} />
            <div className="mt-8">
              <ListingContentSections sections={l.content_sections} locale={locale} />
            </div>
            <div className="mt-8"><ListingFeatures features={l.features} /></div>
          </section>

          {/* 4. Price and costs */}
          <section className={GAP}>
            <ListingSpecs listing={l} locale={locale} settings={settings} />
          </section>

          {/* 6. Energy certificate */}
          <section className={GAP}>
            <EnergyPanel
              energy={l.energy}
              propertyType={l.property_type}
              exemption={l.energy_exemption}
              country={settings.country}
            />
          </section>

          {/* 7. Floor plans and renderings */}
          <section className={GAP}>
            <ListingFloorPlans images={l.images} locale={locale} />
          </section>

          {/* 8. Location */}
          <section className={GAP}>
            <ListingLocationMap listing={l} locale={locale} />
          </section>

          {/* 9. Documents */}
          {documentsEnabled ? (
            <section className={GAP}>
              <ListingDocuments documents={documents.data ?? []} />
            </section>
          ) : null}
        </div>

        <ListingStickyRail
          listing={l}
          locale={locale}
          settings={settings}
          contactHref={`#${CONTACT_ID}`}
        />
      </div>

      <div className="mx-auto max-w-[1080px] px-6 lg:px-8">
        <section className={GAP}>
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t("listings.detail.share")}
          </div>
          <div className="mt-4">
            <ShareButtons url={shareUrl} title={title} />
          </div>
        </section>

        {/* 10. Other properties that can actually be enquired about */}
        {relatedItems.length > 0 ? (
          <section className={GAP}>
            <RelatedListings items={relatedItems} locale={locale} settings={settings} />
          </section>
        ) : null}

        <section id={CONTACT_ID} className={`${GAP} scroll-mt-28`}>
          <ListingAgent listingId={l.id} settings={settings} />
        </section>
      </div>

      <ListingActionBar
        listing={l}
        locale={locale}
        settings={settings}
        contactId={CONTACT_ID}
      />
    </>
  );
}
