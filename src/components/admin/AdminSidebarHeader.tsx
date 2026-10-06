import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SidebarHeader } from "@/components/ui/sidebar";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";

/**
 * The shared brand mark above the admin menu, linking back to the dashboard.
 */
export function AdminSidebarHeader() {
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  return (
    <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
      <Link
        to="/admin"

        className="flex min-h-16 w-full items-center"
        aria-label={settings.site_name}
      >
        <SiteLogo
          settings={settings}
          tone="light"
        />
      </Link>
    </SidebarHeader>
  );
}
