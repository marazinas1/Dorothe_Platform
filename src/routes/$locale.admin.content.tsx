import { createFileRoute } from "@tanstack/react-router";

import { HomeAdminPage } from "@/components/admin/home/HomeAdminPage";

export const Route = createFileRoute("/$locale/admin/content")({
  staticData: { sitemap: false },
  component: HomeAdminPage,
});
