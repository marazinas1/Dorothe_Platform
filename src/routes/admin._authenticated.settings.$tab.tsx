import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { BusinessTab } from "@/components/admin/settings/BusinessTab";
import { HomeAdminPage } from "@/components/admin/home/HomeAdminPage";
import { PageAdminPage } from "@/components/admin/pages/PageAdminPage";

const TABS = ["business", "home", "selling", "inheritance", "about", "contact"] as const;
type Tab = (typeof TABS)[number];

/** Retired tab ids keep their old bookmarks: land on the merged Business tab. */
const LEGACY = new Set([
  "general",
  "texts",
  "modules",
  "branding",
  "analytics",
  "appearance",
  "maintenance",
  "legal",
  // Collections live under Manage; legal texts are fixed templates.
  "properties",
  "blog",
  "imprint",
  "privacy",
  "terms",
]);

export const Route = createFileRoute("/admin/_authenticated/settings/$tab")({
  staticData: { sitemap: false },
  beforeLoad: ({ params }) => {
    if ((TABS as readonly string[]).includes(params.tab)) return;
    if (LEGACY.has(params.tab)) {
      throw redirect({
        to: "/admin/settings/$tab",
        params: { tab: "business" },
        replace: true,
      });
    }
    throw notFound();
  },
  component: TabPage,
});

function TabPage() {
  const { tab } = Route.useParams() as { tab: Tab };
  switch (tab) {
    case "business":
      return <BusinessTab />;
    case "home":
      return <HomeAdminPage embedded />;
    default:
      return <PageAdminPage page={tab} embedded />;
  }
}
