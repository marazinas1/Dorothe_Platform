import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import { HomeMediaEditor } from "@/components/admin/home/HomeMediaEditor";
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
 * The fields on the left, the real page on the right, so every change can be
 * checked against the finished look. Same shape as the home page editor.
 */
export function PageEditorWorkspace({
  definition,
  admin,
  locales,
  locale,
  onLocale,
}: Props) {
  const { t } = useTranslation();
  const [frameKey, setFrameKey] = useState(0);
  const pageUrl = `/${locale}/${definition.path}`;

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
            <RotateCw className="mr-2 h-3.5 w-3.5" />
            {t("admin.pages.refresh")}
          </Button>
          <Button asChild type="button" variant="outline" size="sm">
            <a href={pageUrl} target="_blank" rel="noopener">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              {t("admin.pages.openPage")}
            </a>
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-6 border-border p-4 sm:p-6 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:border-r">
          <PageTextEditor
            definition={definition}
            value={admin.value}
            onChange={admin.setValue}
            placeholder={(key, kind) =>
              kind === "list" ? admin.resolved.lines(key).join("\n") : admin.resolved.text(key)
            }
          />

          {definition.mediaSlots.length > 0 ? (
            <HomeMediaEditor
              slots={definition.mediaSlots as never}
              entry={admin.mediaEntry}
              onChange={admin.setMediaEntry}
              resolved={(slot) => admin.resolved.media(slot)}
            />
          ) : null}

          <SaveButton onSubmit={admin.save} />
        </div>

        <div className="hidden bg-muted/40 lg:block">
          <iframe
            key={frameKey}
            src={pageUrl}
            title={definition.key}
            className="h-[calc(100vh-14rem)] w-full border-0 bg-background"
          />
        </div>
      </div>
    </div>
  );
}
