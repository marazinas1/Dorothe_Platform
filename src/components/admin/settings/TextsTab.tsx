import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { HomeAdminPage } from "@/components/admin/home/HomeAdminPage";
import { PageAdminPage } from "@/components/admin/pages/PageAdminPage";

/**
 * The words of the public site, page by page, in the order the site menu shows
 * them. Rarely changed, so it lives here rather than in the daily workspace.
 */
const PAGES = ["home", "selling", "inheritance", "about", "contact"] as const;
type PageId = (typeof PAGES)[number];

export function TextsTab() {
  const { t } = useTranslation();
  const [page, setPage] = useState<PageId>("home");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("admin.settings.tabs.texts")}>
        {PAGES.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={page === id}
            onClick={() => setPage(id)}
            className={cn(
              "border px-3 py-1.5 text-sm transition-colors",
              page === id
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`admin.nav.${id === "home" ? "content" : id}`)}
          </button>
        ))}
      </div>

      {page === "home" ? <HomeAdminPage /> : <PageAdminPage page={page} />}
    </div>
  );
}
