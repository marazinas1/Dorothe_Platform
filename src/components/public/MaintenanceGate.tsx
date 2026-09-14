import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { currentUserQueryOptions } from "@/lib/auth/current-user.functions";
import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/types/site-settings";
import { MaintenanceBanner } from "./MaintenanceBanner";
import { MaintenancePage } from "./MaintenancePage";

export function MaintenanceGate({ children, locale, settings }: { children: ReactNode; locale: Locale; settings: SiteSettings }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const user = useQuery(currentUserQueryOptions);
  const [previewAsVisitor, setPreviewAsVisitor] = useState(false);

  const privateRoute = pathname.includes("/admin") || pathname.includes("/auth/");
  if (!settings.maintenance_mode || privateRoute) return children;

  // Until the auth check resolves, show less — never the real content.
  if (user.isPending || previewAsVisitor) {
    return <MaintenancePage locale={locale} settings={settings} />;
  }

  // Signed-in staff with an active profile see the real site, with a
  // persistent banner making clear visitors do not.
  if (user.data?.profile.is_active) {
    return (
      <>
        <MaintenanceBanner locale={locale} onPreview={() => setPreviewAsVisitor(true)} />
        {children}
      </>
    );
  }

  return <MaintenancePage locale={locale} settings={settings} />;
}
