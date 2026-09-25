import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { markInternalBrowser } from "@/lib/analytics/use-page-tracking";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import type { Locale } from "@/i18n/config";
import type { VerifiedAdminProfile } from "@/lib/auth/admin-gate.server";

import { AdminSidebar } from "./AdminSidebar";
import { AdminLocaleToggle } from "./AdminLocaleToggle";
import { AdminThemeScope } from "./AdminThemeScope";

export function AdminShell({
  children,
  profile,
  interfaceLocale,
}: {
  children: React.ReactNode;
  profile: VerifiedAdminProfile;
  interfaceLocale: Locale;
}) {
  const { t } = useTranslation();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);

  // Staff browsers are excluded from public statistics, even after sign-out.
  useEffect(() => markInternalBrowser(), []);

  const displayName = profile.full_name || profile.email || t("admin.topbar.unknownUser");
  const roleLabel = t(`admin.role.${profile.role}`);

  return (
    <AdminThemeScope>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background font-sans text-foreground">

        <AdminSidebar email={profile.email ?? displayName} roleLabel={roleLabel} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger
                aria-label={t("admin.topbar.toggleSidebar")}
                className="text-foreground md:hidden"
              />
              <span className="admin-topbar-title truncate text-base font-extrabold">
                {t("admin.topbar.title", { site: settings.site_name })}
              </span>
            </div>
            <AdminLocaleToggle current={interfaceLocale} />
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
        </div>
        </div>
      </SidebarProvider>
    </AdminThemeScope>
  );
}
