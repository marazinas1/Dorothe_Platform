import { createFileRoute } from "@tanstack/react-router";

import { PageAdminPage } from "@/components/admin/pages/PageAdminPage";

export const Route = createFileRoute("/$locale/admin/pages/$page")({
  staticData: { sitemap: false },
  component: PageRoute,
});

function PageRoute() {
  const { page } = Route.useParams();
  return <PageAdminPage page={page} />;
}
