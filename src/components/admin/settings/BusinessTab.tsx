import { useTranslation } from "react-i18next";

import { AdminSection } from "@/components/admin/ui/AdminSection";

import { BusinessForm } from "./BusinessForm";
import { BrandAssetsSection } from "./BrandAssetsSection";
import { MaintenanceCard } from "./MaintenanceCard";

/** Business identity, contact details, brand images and maintenance in one tab. */
export function BusinessTab() {
  const { t } = useTranslation();
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
    </div>
  );
}
