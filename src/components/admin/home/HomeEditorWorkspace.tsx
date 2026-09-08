import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ExternalLink, RotateCw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import { homeMedia } from "@/lib/home/content";
import { HOME_TEMPLATES, type HomeTemplateKey } from "@/lib/home/templates";
import type { useHomeAdmin } from "@/lib/home/use-home-admin";

import { HomeMediaEditor } from "./HomeMediaEditor";
import { HomeTextEditor } from "./HomeTextEditor";

type Props = {
  template: HomeTemplateKey | null;
  previewUrl: string | null;
  onClose: () => void;
  home: ReturnType<typeof useHomeAdmin>;
  locales: string[];
  locale: string;
  onLocale: (next: string) => void;
};

/**
 * Full-screen editor for one design: the fields on the left, the real page on
 * the right, so every change can be checked against the finished look. Property
 * cards are not edited here — they come from Listings.
 */
export function HomeEditorWorkspace({
  template,
  previewUrl,
  onClose,
  home,
  locales,
  locale,
  onLocale,
}: Props) {
  const { t } = useTranslation();
  const [frameKey, setFrameKey] = useState(0);
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={t("admin.home.close")}>
          <X className="h-4 w-4" />
        </Button>
        <h2 className="font-heading text-lg font-semibold">
          {t(`admin.home.templates.${template}.label`)}
        </h2>

        <div className="ml-auto flex items-center gap-2">
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFrameKey((n) => n + 1)}
          >
            <RotateCw className="mr-2 h-3.5 w-3.5" />
            {t("admin.home.refresh")}
          </Button>
          {previewUrl ? (
            <Button asChild type="button" variant="outline" size="sm">
              <a href={previewUrl} target="_blank" rel="noopener">
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                {t("admin.home.preview")}
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="min-h-0 space-y-6 overflow-y-auto border-border p-4 sm:p-6 lg:border-r">
          <HomeTextEditor template={template} value={home.value} onChange={home.setValue} />

          <HomeMediaEditor
            slots={HOME_TEMPLATES[template].media}
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

        <div className="hidden min-h-0 bg-muted lg:block">
          <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.home.livePreview")}
          </div>
          {previewUrl ? (
            <iframe
              key={frameKey}
              src={previewUrl}
              title={t("admin.home.livePreview")}
              className="h-[calc(100%-33px)] w-full border-0 bg-background"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              {t("admin.home.thumbLoading")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
