import { usePublicLocale } from "@/lib/config/use-public-locale";
import { useParams, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AdminTabs } from "@/components/admin/ui/AdminTabs";
import type { Locale } from "@/i18n/config";
import { useFeatureFlag } from "@/hooks/use-feature-flag";

/**
 * Business & appearance first, then one tab per public page in the exact order
 * and with the exact names the site menu uses, then the legal pages last.
 */
const TABS = ["business", "home", "selling", "inheritance", "about", "contact"] as const;
export type SettingsTabId = (typeof TABS)[number];

export function SettingsTabs() {
  const locale = usePublicLocale();
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const teamEnabled = useFeatureFlag("team");

  return (
    <AdminTabs
      label={t("admin.settings.title")}
      items={TABS.map((tab) => ({
        id: tab,
        label: tab === "about"
          ? t(teamEnabled ? "admin.settings.tabs.about_us" : "admin.settings.tabs.about")
          : t(`admin.settings.tabs.${tab}`),
        to: "/admin/settings/$tab",
        params: { tab },
        active: pathname === `/admin/settings/${tab}`,
      }))}
    />
  );
}
