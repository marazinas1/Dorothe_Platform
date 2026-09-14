import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/i18n/config";

export function MaintenanceBanner({ locale, onPreview }: { locale: Locale; onPreview: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="sticky top-0 z-50 border-b border-border bg-secondary px-4 py-2 text-secondary-foreground">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs">
        <p>{t("maintenance.banner")}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPreview}
            className="font-semibold underline underline-offset-2"
          >
            {t("maintenance.previewAsVisitor")}
          </button>
          <Link
            to="/$locale/admin/settings/$tab"
            params={{ locale, tab: "maintenance" }}
            className="font-semibold underline underline-offset-2"
          >
            {t("maintenance.turnOff")}
          </Link>
        </div>
      </div>
    </div>
  );
}
