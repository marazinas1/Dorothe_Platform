import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pickLocalized } from "@/lib/listings/format";
import { payloadEntries, type AdminInquiryDetailView } from "./detail-types";
import { InquiryWorkflow } from "./InquiryWorkflow";
import { InquiryStatusBadge, InquiryTypeBadge, formatInquiryDate } from "./InquiryBadges";
import { SellerPhotos } from "./SellerPhotos";

function waLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

export function InquiryDetail({
  detail,
  locale,
}: {
  detail: AdminInquiryDetailView;
  locale: string;
}) {
  const { t } = useTranslation();
  const { inquiry, photoUrls } = detail;
  const details = payloadEntries(inquiry.payload);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <InquiryTypeBadge type={inquiry.type} />
        <InquiryStatusBadge status={inquiry.status} />
        <span className="text-xs text-muted-foreground">
          {formatInquiryDate(inquiry.created_at, locale)}
        </span>
      </div>

      <InquiryWorkflow inquiry={inquiry} locale={locale} />

      <section className="space-y-3 rounded-[var(--radius)] border border-border bg-card p-4">
        <h1 className="text-2xl font-extrabold">{inquiry.name || inquiry.email}</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={`mailto:${inquiry.email}`}>
              <Mail className="h-4 w-4" />
              {inquiry.email}
            </a>
          </Button>
          {inquiry.phone ? (
            <>
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${inquiry.phone}`}>
                  <Phone className="h-4 w-4" />
                  {inquiry.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={waLink(inquiry.phone)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  {t("admin.inquiries.detail.whatsapp")}
                </a>
              </Button>
            </>
          ) : null}
        </div>
      </section>

      {inquiry.listing ? (
        <section className="space-y-1">
          <h2 className="admin-section-title">{t("admin.inquiries.detail.listing")}</h2>
          <Link
            to="/admin/listings/$id"
            params={{ id: inquiry.listing.id }}
            className="text-sm underline underline-offset-4"
          >
            {pickLocalized(inquiry.listing.title, locale) || inquiry.listing.slug}
          </Link>
        </section>
      ) : null}

      {inquiry.message ? (
        <section className="space-y-2">
          <h2 className="admin-section-title">{t("admin.inquiries.detail.message")}</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{inquiry.message}</p>
        </section>
      ) : null}

      {details.length > 0 ? (
        <section className="space-y-2">
          <h2 className="admin-section-title">{t("admin.inquiries.detail.details")}</h2>
          <dl className="divide-y divide-border overflow-hidden rounded-[var(--radius)] border border-border text-sm">
            {details.map(([key, value]) => (
              <div key={key} className="flex gap-4 px-4 py-2">
                <dt className="w-1/2 text-muted-foreground">
                  {t(`admin.inquiries.fields.${key}`, { defaultValue: key })}
                </dt>
                <dd className="w-1/2">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <SellerPhotos urls={photoUrls} />

      <p className="text-xs text-muted-foreground">
        {t("admin.inquiries.detail.locale")}: {inquiry.locale ?? "—"} ·{" "}
        {t("admin.inquiries.detail.source")}: {inquiry.source ?? "—"}
      </p>
    </div>
  );
}
