import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BarChart3, Clock, Eye, FileText, Inbox, Layers, MousePointerClick, TrendingUp } from "lucide-react";

import { analyticsSummaryQueryOptions } from "@/lib/analytics/admin.functions";
import {
  ANALYTICS_RANGES,
  buildSeries,
  formatDuration,
  percentChange,
  type AnalyticsRange,
} from "@/lib/analytics/summary";
import { StatCard } from "./StatCard";
import { BreakdownList } from "./BreakdownList";
import { TrafficChart } from "./TrafficChart";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/ui/AdminErrorState";
import { AdminTabButtons } from "@/components/admin/ui/AdminTabButtons";

const pct = (part: number, whole: number) => (whole ? ((part / whole) * 100).toFixed(1) : "0.0");

export function AnalyticsPage() {
  const { t } = useTranslation();
  const { locale } = useParams({ from: "/admin/analytics" });
  const [range, setRange] = useState<AnalyticsRange>(30);
  const query = useQuery(analyticsSummaryQueryOptions(range));
  const { data, isPending, error } = query;

  const cur = data?.totals;
  const prev = data?.previous;
  const views = Number(cur?.views ?? 0);
  const visits = Number(cur?.visits ?? 0);
  const single = Number(cur?.single_page ?? 0);
  const inquiries = Number(data?.inquiries ?? 0);
  const ppv = visits ? (views / visits).toFixed(1) : "0.0";

  const picker = (
    <AdminTabButtons
      label={t("admin.analytics.title")}
      items={ANALYTICS_RANGES.map((r) => ({ id: r, label: t("admin.analytics.range", { count: r }) }))}
      value={range}
      onChange={setRange}
    />
  );

  return (
    <div className="space-y-5">
      <AdminPageHeader icon={BarChart3} title={t("admin.analytics.title")} description={t("admin.analytics.subtitle")} actions={picker} />

      {error ? (
        <AdminErrorState
          title={t("admin.analytics.error")}
          detail={error instanceof Error ? error.message : undefined}
          retryLabel={t("errors.tryAgain")}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {isPending ? (
        <AdminEmptyState icon={BarChart3} title={t("admin.analytics.loading")} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={t("admin.analytics.visits")} value={visits} change={percentChange(visits, Number(prev?.visits ?? 0))} icon={MousePointerClick} />
            <StatCard label={t("admin.analytics.views")} value={views} change={percentChange(views, Number(prev?.views ?? 0))} icon={Eye} />
            <StatCard label={t("admin.analytics.avgTime")} value={formatDuration(Number(cur?.avg_seconds ?? 0))} icon={Clock} />
            <StatCard label={t("admin.analytics.singlePage")} value={pct(single, visits)} suffix="%" icon={FileText} />
            <StatCard label={t("admin.analytics.pagesPerVisit")} value={ppv} icon={Layers} />
            <StatCard label={t("admin.analytics.inquiries")} value={inquiries} icon={Inbox} />
            <StatCard label={t("admin.analytics.conversion")} value={pct(inquiries, visits)} suffix="%" icon={TrendingUp} />
          </div>

          <TrafficChart data={buildSeries(data?.daily ?? [], range)} locale={locale} />

          <div className="grid gap-3 lg:grid-cols-3">
            <BreakdownList title={t("admin.analytics.topPages")} total={views} empty={t("admin.analytics.emptyPages")}
              rows={(data?.top_pages ?? []).map((p) => ({ label: p.path, views: Number(p.views) }))} />
            <BreakdownList title={t("admin.analytics.channels")} total={visits} empty={t("admin.analytics.emptyPages")}
              rows={(data?.channels ?? []).map((c) => ({ label: t(`admin.analytics.channel.${c.channel}`, { defaultValue: c.channel }), views: Number(c.views) }))} />
            <BreakdownList title={t("admin.analytics.referrers")} total={visits} empty={t("admin.analytics.emptyReferrers")}
              rows={(data?.referrers ?? []).map((r) => ({ label: r.referrer_host, views: Number(r.views) }))} />
            <BreakdownList title={t("admin.analytics.countries")} total={visits} empty={t("admin.analytics.emptyCountries")}
              rows={(data?.countries ?? []).map((c) => ({ label: c.country, views: Number(c.views) }))} />
            <BreakdownList title={t("admin.analytics.devices")} total={visits} empty={t("admin.analytics.emptyDevices")}
              rows={(data?.devices ?? []).map((d) => ({ label: t(`admin.analytics.device.${d.device}`, { defaultValue: d.device }), views: Number(d.views) }))} />
          </div>

          {visits === 0 ? <p className="text-sm text-muted-foreground">{t("admin.analytics.emptyHint")}</p> : null}

          <section className="rounded-[var(--radius)] border border-border bg-muted p-4">
            <h2 className="admin-label text-muted-foreground">{t("admin.analytics.methodTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("admin.analytics.method")}</p>
          </section>
        </>
      )}
    </div>
  );
}
