import { Link, useParams, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

/**
 * Three tabs, nothing more: the business itself, the words of the public
 * pages, and the legal texts. Modules are a code decision, not a setting.
 */
const TABS = ["business", "texts", "legal"] as const;
export type SettingsTabId = (typeof TABS)[number];

export function SettingsTabs() {
  const { locale } = useParams({ strict: false }) as { locale: Locale };
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="mb-6 flex flex-wrap gap-1 border-b border-border"
      aria-label={t("admin.settings.title")}
    >
      {TABS.map((tab) => {
        const target = `/${locale}/admin/settings/${tab}`;
        const active = pathname === target;
        return (
          <Link
            key={tab}
            to="/$locale/admin/settings/$tab"
            params={{ locale, tab }}
            className={cn(
              "border-b-2 px-3 py-2 text-sm transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`admin.settings.tabs.${tab}`)}
          </Link>
        );
      })}
    </nav>
  );
}
