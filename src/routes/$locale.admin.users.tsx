import { createFileRoute } from "@tanstack/react-router";

import { UsersPage } from "@/components/admin/users/UsersPage";

export const Route = createFileRoute("/$locale/admin/users")({
  staticData: { sitemap: false },
  component: UsersPage,
});
