import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import { UnsavedChangesGuard } from "@/components/admin/ui/UnsavedChangesGuard";
import { homeMedia } from "@/lib/home/content";
import { HOME_MEDIA_SLOTS } from "@/lib/home/layout";
import type { useHomeAdmin } from "@/lib/home/use-home-admin";

import { HomeMediaEditor } from "./HomeMediaEditor";
import { HomeTextEditor } from "./HomeTextEditor";

type Props = {
  home: ReturnType<typeof useHomeAdmin>;
  locales: string[];
  locale: string;
  onLocale: (next: string) => void;
};

/**
 * Full-width page-spine editor with a direct link to the public page.
 */
export function HomeEditorWorkspace({ home, locales, locale, onLocale }: Props) {
  const { t } = useTranslation();
  const pageUrl = `/${locale}`;

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
      <UnsavedChangesGuard dirty={home.dirty} />
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
              {t("admin.home.openPage")}
            </a>
          </Button>
        </div>
      </header>

      <div className="space-y-8 p-4 sm:p-6">
          <HomeTextEditor
            locale={locale}
            value={home.value}
            placeholder={home.placeholder}
            isLocked={home.isLocked}
            lockedCount={home.lockedCount}
            fieldCount={home.fieldCount}
            onChange={home.setValue}
            onReset={home.resetValue}
            onSetDefault={(key, kind) => void home.setAsDefault(key, kind)}
            onLockAll={home.lockAllDefaults}
          />


          <HomeMediaEditor
            slots={HOME_MEDIA_SLOTS}
            entry={home.mediaEntry}
            onChange={home.setMediaEntry}
            resolved={(slot) => homeMedia(home.settings, slot as never)}
          />

          <SaveButton
            onSubmit={async () => {
              await home.save();
              toast.success(t("admin.home.saved"));
            }}
          />
      </div>
    </div>
  );
}
