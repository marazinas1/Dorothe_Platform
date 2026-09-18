import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";

import { AdminSection } from "@/components/admin/ui/AdminSection";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";
import { usePermission } from "@/lib/auth/use-permission";
import { TechnicalBlock } from "./TechnicalBlock";

import { BusinessForm } from "./BusinessForm";
import { BrandAssetsSection } from "./BrandAssetsSection";
import { MaintenanceCard } from "./MaintenanceCard";

/** Business identity, contact details, brand images and maintenance in one tab. */
export function BusinessTab() {
  const { t } = useTranslation();
  const canDesign = usePermission("design.edit");
  const { data } = useSuspenseQuery(siteSettingsQueryOptions);
  return (
    <div className="space-y-10">
      <BusinessForm />

      <AdminSection
        title={t("admin.settings.brand.title")}
        description={t("admin.settings.brand.help")}
      >
        <BrandAssetsSection />
      </AdminSection>

      <MaintenanceCard />

      {canDesign ? <TechnicalBlock data={data} /> : null}
    </div>
  );
}
