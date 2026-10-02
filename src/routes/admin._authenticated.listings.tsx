import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authenticated/listings")({
  staticData: { sitemap: false },
  component: () => <Outlet />,
});
