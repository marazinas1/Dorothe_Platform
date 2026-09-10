import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import type { Locale } from "@/i18n/config";
import type { VerifiedAdminProfile } from "@/lib/auth/admin-gate.server";

import { AdminSidebar } from "./AdminSidebar";
import { AdminLocaleToggle } from "./AdminLocaleToggle";

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

  // Dropdowns and dialogs render into <body> through a portal, so the admin
  // theme has to reach the body too — otherwise menus pick up the client's
  // public palette instead of the fixed admin one.
  useEffect(() => {
    document.body.classList.add("admin-theme");
    return () => document.body.classList.remove("admin-theme");
  }, []);

  const displayName = profile.full_name || profile.email || t("admin.topbar.unknownUser");
  const roleLabel = t(`admin.role.${profile.role}`);

  return (
    <SidebarProvider>
      {/* The admin has its own fixed design system, identical in every clone. */}
      <div className="admin-theme flex min-h-screen w-full bg-background text-foreground">

        <AdminSidebar email={profile.email ?? displayName} roleLabel={roleLabel} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger
                aria-label={t("admin.topbar.toggleSidebar")}
                className="text-foreground"
              />
              <span className="truncate text-sm font-medium tracking-tight">
                {t("admin.topbar.title", { site: settings.site_name })}
              </span>
            </div>
            <AdminLocaleToggle current={interfaceLocale} />
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
