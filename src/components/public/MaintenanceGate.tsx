import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { currentUserQueryOptions } from "@/lib/auth/current-user.functions";
import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/types/site-settings";
import { MaintenancePage } from "./MaintenancePage";

export function MaintenanceGate({ children, locale, settings }: { children: ReactNode; locale: Locale; settings: SiteSettings }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const user = useQuery(currentUserQueryOptions);
  const privateRoute = pathname.includes("/admin") || pathname.includes("/auth/");
  if (settings.maintenance_mode && !privateRoute && !user.isPending && !user.data?.profile.is_active) {
    return <MaintenancePage locale={locale} settings={settings} />;
  }
  return children;
}