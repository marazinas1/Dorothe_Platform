import { useTranslation } from "react-i18next";
import { Link, useParams } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { AdminSection } from "@/components/admin/ui/AdminSection";
import { Button } from "@/components/ui/button";

export function PropertiesCopyTab() {
  const { t } = useTranslation();
  const { locale } = useParams({ strict: false }) as { locale: string };
  return (
    <AdminSection title={t("admin.settings.properties.title")} description={t("admin.settings.properties.help")}>
      <p className="text-sm text-muted-foreground">{t("admin.settings.properties.body")}</p>
      <div className="mt-4">
        <Button asChild variant="outline">
          <Link to="/$locale/immobilien" params={{ locale }} target="_blank">
            <ExternalLink className="h-4 w-4" />
            {t("admin.settings.properties.open")}
          </Link>
        </Button>
      </div>
    </AdminSection>
  );
}