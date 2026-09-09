import { createFileRoute } from "@tanstack/react-router";

import { AnalyticsPage } from "@/components/admin/analytics/AnalyticsPage";

export const Route = createFileRoute("/$locale/admin/analytics")({
  staticData: { sitemap: false },
  component: AnalyticsPage,
});
