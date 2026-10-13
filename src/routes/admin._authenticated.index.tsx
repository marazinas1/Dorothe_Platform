import { usePublicLocale } from "@/lib/config/use-public-locale";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { NeedsAttention } from "@/components/admin/dashboard/NeedsAttention";
import { DefaultRequestQueue } from "@/components/admin/copy/DefaultRequestQueue";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { MetricsPanel } from "@/components/admin/dashboard/MetricsPanel";
import { PeriodPicker } from "@/components/admin/dashboard/PeriodPicker";
import { FirstRun } from "@/components/admin/dashboard/FirstRun";
import { metricsQueryOptions } from "@/lib/dashboard/admin.functions";
import { DEFAULT_PERIOD, resolvePeriod, type PeriodPreset } from "@/lib/dashboard/period";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export const Route = createFileRoute("/admin/_authenticated/")({
  staticData: { sitemap: false },
  component: Dashboard,
});

function Dashboard() {
  const { t } = useTranslation();
  const locale = usePublicLocale();
  const [period, setPeriod] = useState<PeriodPreset>(DEFAULT_PERIOD);
  const { from, to } = resolvePeriod(period);

  // Distinguishes "nothing to do" from "nothing exists yet".
  const overview = useQuery(metricsQueryOptions(from, to));
  const empty = overview.data?.totalListings === 0;

  return (
    <div className="space-y-8">
      <AdminPageHeader title={t("admin.pages.dashboard")} description={t("admin.dashboard.subtitle")} />

        <section className="space-y-4">
          <DefaultRequestQueue />
          {empty ? <FirstRun locale={locale} /> : <NeedsAttention locale={locale} />}
        </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="admin-section-title">{t("admin.dashboard.metrics.heading")}</h2>
          <div className="ml-auto">
            <PeriodPicker value={period} onChange={setPeriod} />
          </div>
        </div>
        <MetricsPanel period={period} />
      </section>
        <QuickActions locale={locale} />
    </div>
  );
}
