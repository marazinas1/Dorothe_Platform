import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Search, Users } from "lucide-react";

import type { ClientSummary } from "@/lib/inquiries/clients";
import { cn } from "@/lib/utils";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { formatInquiryDate } from "./InquiryBadges";

/** One row per person; opening a row goes to their latest enquiry. */
export function ClientsList({ clients, locale }: { clients: ClientSummary[]; locale: string }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const visible = useMemo(
    () => clients.filter((c) => !q || [c.name, c.email, c.phone].join(" ").toLowerCase().includes(q)),
    [clients, q],
  );

  if (clients.length === 0) return <AdminEmptyState icon={Users} title={t("admin.clients.empty")} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-h-10 min-w-[220px] max-w-[420px] flex-1 items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.clients.search")}
            aria-label={t("admin.clients.search")}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
        <span className="ml-auto text-sm text-muted-foreground">
          {t("admin.clients.matches", { count: visible.length })}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("admin.inquiries.noMatches")}</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius)] border border-border bg-card">
          {visible.map((c) => (
            <li key={c.email}>
              <Link
                to="/admin/inquiries/$id"
                params={{ id: c.lastId }}
                className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted md:grid-cols-[10px_minmax(0,260px)_minmax(0,1fr)_auto]"
              >
                <span className={cn("h-2 w-2 rounded-full", c.unread ? "bg-primary" : "bg-border")} aria-hidden />
                <span className="min-w-0">
                  <b className="block truncate text-sm font-semibold">{c.name || c.email}</b>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.email}{c.phone ? ` · ${c.phone}` : ""}
                  </span>
                </span>
                <span className="hidden truncate text-sm text-muted-foreground md:block">
                  {c.types.map((ty) => t(`admin.inquiries.types.${ty}`)).join(", ")}
                </span>
                <span className="text-right text-xs text-muted-foreground tabular-nums">
                  <span className="block font-semibold text-foreground">
                    {t("admin.clients.enquiries", { count: c.count })}
                  </span>
                  {formatInquiryDate(c.lastAt, locale)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
