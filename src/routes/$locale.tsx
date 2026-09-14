import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { I18nProvider } from "@/i18n/provider";
import { isLocale, type Locale } from "@/i18n/config";
import {
  getSiteSettings,
  siteSettingsQueryOptions,
} from "@/lib/config/site-settings.functions";
import { featureFlagsQueryOptions } from "@/lib/config/feature-flags.functions";
import { usePageTracking } from "@/lib/analytics/use-page-tracking";
import { MaintenanceGate } from "@/components/public/MaintenanceGate";

export const Route = createFileRoute("/$locale")({
  staticData: { sitemap: false },
  beforeLoad: async ({ params }) => {
    const settings = await getSiteSettings();
    const enabled = settings.enabled_locales;
    if (!enabled.includes(params.locale) || !isLocale(params.locale)) {
      throw redirect({
        to: "/$locale",
        params: { locale: settings.default_locale },
      });
    }
  },
  loader: async ({ context }) => {
    const [settings] = await Promise.all([
      context.queryClient.ensureQueryData(siteSettingsQueryOptions),
      context.queryClient.ensureQueryData(featureFlagsQueryOptions),
    ]);
    return { settings };
  },
  head: ({ loaderData }) =>
    loaderData?.settings.maintenance_mode
      ? { meta: [{ name: "robots", content: "noindex,nofollow" }] }
      : {},
  component: LocaleLayout,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-destructive">
      Failed to load: {error instanceof Error ? error.message : String(error)}
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-8 text-sm">Not found</div>
  ),
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const { settings } = Route.useLoaderData();
  usePageTracking();
  return (
    <I18nProvider locale={locale as Locale}>
      <MaintenanceGate locale={locale as Locale} settings={settings}>
        <Outlet />
      </MaintenanceGate>
    </I18nProvider>
  );
}
