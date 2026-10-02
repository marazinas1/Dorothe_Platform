import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authenticated/inquiries")({
  staticData: { sitemap: false },
  component: () => <Outlet />,
});
