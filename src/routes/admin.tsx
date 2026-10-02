import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { featureFlagsQueryOptions } from "@/lib/config/feature-flags.functions";
import { resolveMessageLocale } from "@/i18n/config";
import { AdminI18nProvider } from "@/i18n/admin-provider";
import { AdminThemeScope } from "@/components/admin/AdminThemeScope";

/**
 * Admin and sign-in live at /admin, independent of the public site language.
 * This unguarded layout loads what the public $locale layout used to provide;
 * the access check lives only in admin._authenticated.tsx.
 */
export const Route = createFileRoute("/admin")({
  staticData: { sitemap: "exclude-subtree" },
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      context.queryClient.ensureQueryData(featureFlagsQueryOptions),
    ]);
  },
  component: AdminRootLayout,
});

function AdminRootLayout() {
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const locale = resolveMessageLocale(null, settings.default_locale);
  return (
    <AdminI18nProvider locale={locale}>
      <AdminThemeScope>
        <div className="min-h-screen bg-background font-sans text-foreground">
          <Outlet />
        </div>
      </AdminThemeScope>
    </AdminI18nProvider>
  );
}
