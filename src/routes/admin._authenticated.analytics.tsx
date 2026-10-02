import { createFileRoute } from "@tanstack/react-router";

import { AnalyticsPage } from "@/components/admin/analytics/AnalyticsPage";

export const Route = createFileRoute("/admin/_authenticated/analytics")({
  staticData: { sitemap: false },
  component: AnalyticsPage,
});
