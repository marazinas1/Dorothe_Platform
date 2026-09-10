import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { BusinessTab } from "@/components/admin/settings/BusinessTab";
import { TextsTab } from "@/components/admin/settings/TextsTab";
import { LegalTab } from "@/components/admin/settings/LegalTab";

const TABS = ["business", "texts", "legal"] as const;
type Tab = (typeof TABS)[number];

/** Retired tab ids keep their old bookmarks: land on the merged Business tab. */
const LEGACY = new Set(["general", "contact", "modules", "branding", "analytics"]);

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
    case "texts":
      return <TextsTab />;
    case "legal":
      return <LegalTab />;
  }
}
