import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ExternalLink, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
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
 * The fields on the left, the real page on the right, so every change can be
 * checked against the finished look.
 */
export function HomeEditorWorkspace({ home, locales, locale, onLocale }: Props) {
  const { t } = useTranslation();
  const [frameKey, setFrameKey] = useState(0);
  const pageUrl = `/${locale}`;

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
      <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        {locales.length > 1
          ? locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLocale(l)}
                className={`rounded-[calc(var(--radius)/1.5)] border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                  l === locale
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {l}
              </button>
            ))
          : null}

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFrameKey((n) => n + 1)}
          >
            <RotateCw className="h-3.5 w-3.5" />
            {t("admin.home.refresh")}
          </Button>
          <Button asChild type="button" variant="outline" size="sm">
            <a href={pageUrl} target="_blank" rel="noopener">
              <ExternalLink className="h-3.5 w-3.5" />
              {t("admin.home.openPage")}
            </a>
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-8 border-border p-4 sm:p-6 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:border-r">
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
              setFrameKey((n) => n + 1);
              toast.success(t("admin.home.saved"));
            }}
          />
        </div>

        <div className="hidden bg-muted lg:block">
          <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.home.livePreview")}
          </div>
          <iframe
            key={frameKey}
            src={pageUrl}
            title={t("admin.home.livePreview")}
            className="h-[calc(100vh-17rem)] w-full border-0 bg-background"
          />
        </div>
      </div>
    </div>
  );
}
