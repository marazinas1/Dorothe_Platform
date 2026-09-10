import { createFileRoute, notFound } from "@tanstack/react-router";

import { GeneralTab } from "@/components/admin/settings/GeneralTab";
import { ContactTab } from "@/components/admin/settings/ContactTab";
import { TextsTab } from "@/components/admin/settings/TextsTab";
import { LegalTab } from "@/components/admin/settings/LegalTab";
import { ModulesTab } from "@/components/admin/settings/ModulesTab";

const TABS = ["general", "contact", "texts", "legal", "modules"] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute("/$locale/admin/settings/$tab")({
  staticData: { sitemap: false },
  beforeLoad: ({ params }) => {
    if (!(TABS as readonly string[]).includes(params.tab)) throw notFound();
  },
  component: TabPage,
});

function TabPage() {
  const { tab } = Route.useParams() as { tab: Tab };
  switch (tab) {
    case "general": return <GeneralTab />;
    case "contact": return <ContactTab />;
    case "texts": return <TextsTab />;
    case "legal": return <LegalTab />;
    case "modules": return <ModulesTab />;
  }
}
