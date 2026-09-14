import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { BusinessTab } from "@/components/admin/settings/BusinessTab";
import { LegalTab } from "@/components/admin/settings/LegalTab";
import { AppearanceTab } from "@/components/admin/settings/AppearanceTab";
import { MaintenanceTab } from "@/components/admin/settings/MaintenanceTab";
import { HomeAdminPage } from "@/components/admin/home/HomeAdminPage";
import { PageAdminPage } from "@/components/admin/pages/PageAdminPage";
import { PropertiesCopyTab } from "@/components/admin/settings/PropertiesCopyTab";

const TABS = ["business", "appearance", "home", "properties", "selling", "inheritance", "about", "contact", "legal", "maintenance"] as const;
type Tab = (typeof TABS)[number];

/** Retired tab ids keep their old bookmarks: land on the merged Business tab. */
const LEGACY = new Set(["general", "texts", "modules", "branding", "analytics"]);

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
    case "appearance":
      return <AppearanceTab />;
    case "home":
      return <HomeAdminPage embedded />;
    case "properties":
      return <PropertiesCopyTab />;
    case "selling":
    case "inheritance":
    case "about":
    case "contact":
      return <PageAdminPage page={tab} embedded />;
    case "legal":
      return <LegalTab />;
    case "maintenance":
      return <MaintenanceTab />;
  }
}
