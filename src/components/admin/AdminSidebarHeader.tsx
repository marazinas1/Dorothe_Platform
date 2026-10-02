import { Link, useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SidebarHeader } from "@/components/ui/sidebar";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import type { Locale } from "@/i18n/config";

/**
 * The shared brand mark above the admin menu, linking back to the dashboard.
 */
export function AdminSidebarHeader() {
  const { locale } = useParams({ strict: false }) as { locale: Locale };
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  return (
    <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
      <Link
        to="/admin"
        params={{ locale }}
        className="flex h-16 items-center"
        aria-label={settings.site_name}
      >
        <SiteLogo
          settings={settings}
          className="max-w-[12rem]"
        />
      </Link>
    </SidebarHeader>
  );
}
