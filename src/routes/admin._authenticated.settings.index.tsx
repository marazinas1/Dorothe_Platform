import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_authenticated/settings/")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({
      to: "/admin/settings/$tab",
      params: { tab: "business" },
    });
  },
});
