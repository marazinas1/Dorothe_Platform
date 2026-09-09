import { createFileRoute } from "@tanstack/react-router";

import { PageAdminPage } from "@/components/admin/pages/PageAdminPage";

export const Route = createFileRoute("/$locale/admin/pages/$page")({
  component: PageRoute,
});

function PageRoute() {
  const { page } = Route.useParams();
  return <PageAdminPage page={page} />;
}
