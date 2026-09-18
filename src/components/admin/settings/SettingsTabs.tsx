import { useParams, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AdminTabs } from "@/components/admin/ui/AdminTabs";
import type { Locale } from "@/i18n/config";

/**
 * Business & appearance first, then one tab per public page in the exact order
 * and with the exact names the site menu uses, and Contact last.
 */
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
export type SettingsTabId = (typeof TABS)[number];

export function SettingsTabs() {
  const { locale } = useParams({ strict: false }) as { locale: Locale };
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AdminTabs
      label={t("admin.settings.title")}
      items={TABS.map((tab) => ({
        id: tab,
        label: t(`admin.settings.tabs.${tab}`),
        to: "/$locale/admin/settings/$tab",
        params: { locale, tab },
        active: pathname === `/${locale}/admin/settings/${tab}`,
      }))}
    />
  );
}
