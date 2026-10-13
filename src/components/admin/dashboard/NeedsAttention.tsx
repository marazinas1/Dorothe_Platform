import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { House, Inbox } from "lucide-react";

import { pickLocalized } from "@/lib/listings/format";
import { inquiryQueueQueryOptions, listingQueueQueryOptions } from "@/lib/dashboard/admin.functions";
import { inquiryTypeKey } from "@/lib/inquiries/types";
import { ageLabel } from "@/lib/dashboard/age";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const ROW = "flex items-center gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0 transition-colors hover:bg-muted";
const ICON = "grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius)] bg-secondary text-foreground";
const PILL = "ml-auto whitespace-nowrap rounded-full px-[9px] py-0.5 text-xs font-semibold";

/** One card, one list: open inquiries first, then listings blocked from publishing. */
export function NeedsAttention({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const inquiries = useQuery(inquiryQueueQueryOptions);
  const blocked = useQuery(listingQueueQueryOptions("blocked"));
  const loading = inquiries.isPending || blocked.isPending;
  const inq = inquiries.data?.items ?? [];
  const lst = blocked.data?.items ?? [];

  return (
    <section className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-bold">{t("admin.dashboard.needsAttention")}</h2>
        <Link to="/admin/inquiries" className="text-sm font-semibold underline-offset-4 hover:underline">
          {t("admin.dashboard.queue.inquiries.all")}
        </Link>
      </div>
      {loading ? (
        <p className="px-5 py-4 text-sm text-muted-foreground">{t("admin.common.loading")}</p>
      ) : inq.length + lst.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted-foreground">{t("admin.dashboard.nothingNeeded")}</p>
      ) : (
        <ul>
          {inq.map((item) => {
            const age = ageLabel(item.created_at);
            return (
              <li key={item.id}>
                <Link to="/admin/inquiries/$id" params={{ id: item.id }} className={ROW}>
                  <span className={ICON}><Inbox className="h-4 w-4" strokeWidth={1.75} /></span>
                  <span className="min-w-0">
                    <b className="block truncate text-sm font-semibold">
                      {t(`admin.inquiries.types.${inquiryTypeKey(item.type)}`)}: {item.name?.trim() || item.email}
                    </b>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[item.listing ? pickLocalized(item.listing.title, locale as Locale) : null, age ? t(age.key, { count: age.count }) : null].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className={cn(PILL, item.status === "new" ? "bg-info/10 text-info" : "bg-warning/10 text-warning")}>
                    {t(`admin.inquiries.status.${item.status}`)}
                  </span>
                </Link>
              </li>
            );
          })}
          {lst.map((item) => (
            <li key={item.id}>
              <Link to="/admin/listings/$id" params={{ id: item.id }} className={ROW}>
                <span className={ICON}><House className="h-4 w-4" strokeWidth={1.75} /></span>
                <span className="min-w-0">
                  <b className="block truncate text-sm font-semibold">
                    {t("admin.dashboard.cannotPublish", { title: pickLocalized(item.title, locale as Locale) || t("admin.listings.untitled") })}
                  </b>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.reasons.map((r) => t(`admin.listings.checklist.items.${r.key}`)).join(", ")}
                  </span>
                </span>
                <span className={cn(PILL, "bg-warning/10 text-warning")}>
                  {t("admin.dashboard.missingCount", { count: item.reasons.length })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
