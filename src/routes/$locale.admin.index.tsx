import { createFileRoute, redirect } from "@tanstack/react-router";

/** /de/admin (no sub-path) → /admin. */
export const Route = createFileRoute("/$locale/admin/")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({ href: "/admin", replace: true });
  },
});
