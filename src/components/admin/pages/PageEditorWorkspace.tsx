import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import { UnsavedChangesGuard } from "@/components/admin/ui/UnsavedChangesGuard";
import { SiteMediaSlot } from "@/components/admin/ui/SiteMediaSlot";
import type { PageDefinition } from "@/lib/pages/fields";
import type { usePageAdmin } from "@/lib/pages/use-page-admin";

import { PageTextEditor } from "./PageTextEditor";

type Props = {
  definition: PageDefinition;
  admin: ReturnType<typeof usePageAdmin>;
  locales: string[];
  locale: string;
  onLocale: (next: string) => void;
};

/**
 * Full-width page-spine editor with a direct link to the public page.
 */
export function PageEditorWorkspace({
  definition,
  admin,
  locales,
  locale,
  onLocale,
}: Props) {
  const { t } = useTranslation();
  const pageUrl = `/${locale}/${definition.path}`;

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
      <UnsavedChangesGuard dirty={admin.dirty} />
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        {locales.length > 1
          ? locales.map((l) => (
              <Button
                key={l}
                type="button"
                variant={l === locale ? "default" : "outline"}
                size="sm"
                onClick={() => onLocale(l)}
                className="admin-label font-semibold"
              >
                {l}
              </Button>
            ))
          : null}

        <div className="ml-auto flex items-center gap-2">
          <Button asChild type="button" variant="outline" size="sm">
            <a href={pageUrl} target="_blank" rel="noopener">
              <ExternalLink className="h-3.5 w-3.5" />
              {t("admin.pageEditor.openPage")}
            </a>
          </Button>
        </div>
      </header>

      <div className="space-y-8 p-4 sm:p-6">
          <PageTextEditor
            definition={definition}
            locale={locale}
            value={admin.value}
            placeholder={admin.placeholder}
            isLocked={admin.isLocked}
            lockedCount={admin.lockedCount}
            fieldCount={admin.fieldCount}
            onChange={admin.setValue}
            onReset={admin.resetValue}
            onSetDefault={(key, kind) => void admin.setAsDefault(key, kind)}
            onLockAll={admin.lockAllDefaults}
          />


          {definition.key === "about" ? <SiteMediaSlot slotKey="about:portrait" /> : null}

          <SaveButton onSubmit={admin.save} />
      </div>
    </div>
  );
}
