import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { adminInquiriesQueryOptions } from "@/lib/inquiries/admin.functions";
import { relatedInquiries } from "@/lib/inquiries/clients";
import { inquiryTypeKey } from "@/lib/inquiries/types";

import { pickLocalized } from "@/lib/listings/format";
import { payloadEntries, type AdminInquiryDetailView } from "./detail-types";
import { InquiryWorkflow } from "./InquiryWorkflow";
import { InquiryStatusBadge, InquiryTypeBadge, formatInquiryDate } from "./InquiryBadges";
import { SellerPhotos } from "./SellerPhotos";
import { InquiryReplies } from "./InquiryReplies";

const card = "rounded-[var(--radius)] border border-border bg-card";
const cardHead = "border-b border-border px-5 py-3.5 text-sm font-bold";

/** Two-column enquiry view: the message and context left, actions right. */
export function InquiryDetail({ detail, locale }: { detail: AdminInquiryDetailView; locale: string }) {
  const { t } = useTranslation();
  const { inquiry, photoUrls } = detail;
  const details = payloadEntries(inquiry.payload);
  const all = useQuery(adminInquiriesQueryOptions);
  const related = all.data ? relatedInquiries(all.data, inquiry) : [];

  const history = [
    { key: "received", label: t("admin.inquiries.detail.history_received"), at: inquiry.created_at },
    { key: "opened", label: t("admin.inquiries.detail.history_opened"), at: inquiry.read_at },
    {
      key: "closed",
      label: t("admin.inquiries.detail.history_closed"),
      at: inquiry.status === "closed" ? inquiry.handled_at : null,
    },
  ].filter((h): h is { key: string; label: string; at: string } => Boolean(h.at));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-extrabold">{inquiry.name || inquiry.email}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <InquiryTypeBadge type={inquiry.type} />
          <InquiryStatusBadge status={inquiry.status} />
          <span className="text-sm text-muted-foreground">
            {t("admin.inquiries.detail.received_at", { date: formatInquiryDate(inquiry.created_at, locale) })}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-4">
          {inquiry.message ? (
            <section className={`${card} p-5`} aria-label={t("admin.inquiries.detail.message")}>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{inquiry.message}</p>
            </section>
          ) : null}

          {inquiry.listing ? (
            <section className={card}>
              <h2 className={cardHead}>{t("admin.inquiries.detail.linked_listing")}</h2>
              <Link
                to="/admin/listings/$id"
                params={{ id: inquiry.listing.id }}
                className="block px-5 py-3.5 text-sm font-semibold underline-offset-4 hover:underline"
              >
                {pickLocalized(inquiry.listing.title, locale) || inquiry.listing.slug}
              </Link>
            </section>
          ) : null}

          {details.length > 0 ? (
            <section className={card}>
              <h2 className={cardHead}>{t("admin.inquiries.detail.details")}</h2>
              <dl className="divide-y divide-border text-sm">
                {details.map(([key, value]) => (
                  <div key={key} className="flex gap-4 px-5 py-2.5">
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

          <InquiryReplies inquiry={inquiry} locale={locale} />

          {related.length > 0 ? (
            <section className={card}>
              <h2 className={cardHead}>{t("admin.clients.other")}</h2>
              <ul className="divide-y divide-border text-sm">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/admin/inquiries/$id"
                      params={{ id: r.id }}
                      className="flex gap-4 px-5 py-2.5 hover:bg-muted"
                    >
                      <span className="w-36 shrink-0 text-muted-foreground tabular-nums">
                        {formatInquiryDate(r.created_at, locale)}
                      </span>
                      <span className="flex-1 truncate">{t(`admin.inquiries.types.${inquiryTypeKey(r.type)}`)}</span>
                      <span className="text-muted-foreground">{t(`admin.inquiries.status.${r.status}`)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className={card}>
            <h2 className={cardHead}>{t("admin.inquiries.detail.history")}</h2>
            <ol className="divide-y divide-border text-sm">
              {history.map((h) => (
                <li key={h.key} className="flex gap-4 px-5 py-2.5">
                  <span className="w-36 shrink-0 text-muted-foreground tabular-nums">
                    {formatInquiryDate(h.at, locale)}
                  </span>
                  <span>{h.label}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6">
          <InquiryWorkflow inquiry={inquiry} />
        </aside>
      </div>
    </div>
  );
}
