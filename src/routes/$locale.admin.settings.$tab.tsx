import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { BusinessTab } from "@/components/admin/settings/BusinessTab";
import { LegalTab } from "@/components/admin/settings/LegalTab";
import { HomeAdminPage } from "@/components/admin/home/HomeAdminPage";
import { PageAdminPage } from "@/components/admin/pages/PageAdminPage";

const TABS = [
  "business",
  "home",
  "properties",
  "selling",
  "inheritance",
  "blog",
  "about",
  "legal",
  "contact",
] as const;
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
]);

export const Route = createFileRoute("/$locale/admin/settings/$tab")({
  staticData: { sitemap: false },
  beforeLoad: ({ params }) => {
    if ((TABS as readonly string[]).includes(params.tab)) return;
    if (LEGACY.has(params.tab)) {
      throw redirect({
        to: "/$locale/admin/settings/$tab",
        params: { locale: params.locale, tab: "business" },
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
    case "legal":
      return <LegalTab />;
    default:
      return <PageAdminPage page={tab} embedded />;
  }
}
