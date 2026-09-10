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
      className="mb-8 inline-flex flex-wrap gap-1 rounded-[var(--radius)] border border-border bg-card p-1"
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
              "rounded-[calc(var(--radius)*0.75)] px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(`admin.settings.tabs.${tab}`)}
          </Link>
        );
      })}
    </nav>
  );
}
