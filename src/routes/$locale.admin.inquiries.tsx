import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/admin/inquiries")({
  staticData: { sitemap: false },
  component: () => <Outlet />,
});
