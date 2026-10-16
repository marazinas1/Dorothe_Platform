import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Inbox, Search } from "lucide-react";

import { inquiryPreview, inquiryTypeKey, type AdminInquiryRow } from "@/lib/inquiries/types";
import { cn } from "@/lib/utils";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminTabButtons } from "@/components/admin/ui/AdminTabButtons";

type Tab = "all" | "unread" | "seller" | "listing" | "general";

const STATUS_TONE: Record<string, string> = {
  new: "bg-info/10 text-info",
  in_progress: "bg-warning/10 text-warning",
  answered: "bg-success/10 text-success",
  closed: "bg-secondary text-muted-foreground",
};

function inTab(row: AdminInquiryRow, tab: Tab) {
  const type = inquiryTypeKey(row.type);
  if (tab === "unread") return !row.read_at;
  if (tab === "seller") return type === "seller";
  if (tab === "listing") return type === "listing";
  if (tab === "general") return type !== "seller" && type !== "listing";
  return true;
}

function relative(iso: string, locale: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (days < 1) {
    const hours = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 3600000));
    return rtf.format(-hours, "hour");
  }
  if (days < 2) return rtf.format(-1, "day");
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(iso));
}

/** Newest-first inbox: tabs with counts, search, one line per message. */
export function InquiriesList({ rows, locale }: { rows: AdminInquiryRow[]; locale: string }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();

  const visible = useMemo(
    () =>
      rows.filter(
        (r) =>
          inTab(r, tab) &&
          (!q || [r.name, r.email, r.phone, r.message].join(" ").toLowerCase().includes(q)),
      ),
    [rows, tab, q],
  );

  if (rows.length === 0) return <AdminEmptyState icon={Inbox} title={t("admin.inquiries.empty")} />;

  const tabs: Tab[] = ["all", "unread", "seller", "listing", "general"];
  return (
    <div className="space-y-5">
      <AdminTabButtons
        label={t("admin.pages.inquiries")}
        value={tab}
        onChange={setTab}
        items={tabs.map((id) => ({
          id,
          label: (
            <>
              {t(`admin.inquiries.tabs.${id}`)}
              <span className="ml-1.5 text-muted-foreground">{rows.filter((r) => inTab(r, id)).length}</span>
            </>
          ),
        }))}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-h-10 min-w-[220px] max-w-[420px] flex-1 items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.inquiries.search")}
            aria-label={t("admin.inquiries.search")}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
        <span className="ml-auto text-sm text-muted-foreground">
          {t("admin.inquiries.matches", { count: visible.length })}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("admin.inquiries.noMatches")}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius)] border border-border bg-card">
          {visible.map((row) => (
            <li key={row.id}>
              <Link
                to="/admin/inquiries/$id"
                params={{ id: row.id }}
                className="grid grid-cols-[10px_minmax(0,220px)_minmax(0,1fr)_auto_auto] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted"
              >
                <span
                  aria-label={row.read_at ? undefined : t("admin.inquiries.tabs.unread")}
                  className={cn("h-2 w-2 rounded-full", row.read_at ? "bg-border" : "bg-primary")}
                />
                <span className="min-w-0">
                  <b className="block truncate text-sm font-semibold">{row.name || row.email}</b>
                  <span className="block truncate text-xs text-muted-foreground">
                    {t(`admin.inquiries.types.${inquiryTypeKey(row.type)}`)}
                  </span>
                  {q && row.message?.toLowerCase().includes(q) ? (
                    <span className="block truncate text-xs text-muted-foreground">
                      ↳ …{row.message.slice(Math.max(0, row.message.toLowerCase().indexOf(q) - 30), row.message.toLowerCase().indexOf(q) + q.length + 30)}…
                    </span>
                  ) : null}
                </span>
                <span className="truncate text-sm text-muted-foreground">{inquiryPreview(row)}</span>
                <span className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                  {relative(row.created_at, locale)}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full px-[9px] py-0.5 text-xs font-semibold",
                    STATUS_TONE[row.status] ?? STATUS_TONE.closed,
                  )}
                >
                  {t(`admin.inquiries.status.${row.status}`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
