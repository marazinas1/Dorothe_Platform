import { useTranslation } from "react-i18next";

import { AdminSection } from "@/components/admin/ui/AdminSection";
import { BrandAssetsSection } from "./BrandAssetsSection";

export function AppearanceTab() {
  const { t } = useTranslation();
  return (
    <AdminSection
      title={t("admin.settings.brand.sectionTitle")}
      description={t("admin.settings.brand.sectionHelp")}
    >
      <BrandAssetsSection />
    </AdminSection>
  );
}