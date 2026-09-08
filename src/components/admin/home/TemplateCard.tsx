import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ExternalLink, Loader2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HomeTemplateDef } from "@/lib/home/templates";

import { TemplateThumb } from "./TemplateThumb";

type Props = {
  template: HomeTemplateDef;
  isActive: boolean;
  previewUrl: string | null;
  onEdit: () => void;
  onActivate: () => Promise<void>;
};

/**
 * One design in the gallery. The whole card is the way in: clicking it opens
 * the editor for that design. The miniature above the title is the real page,
 * rendered small, so the owner recognises what she is choosing.
 */
export function TemplateCard({ template, isActive, previewUrl, onEdit, onActivate }: Props) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  async function activate(e: React.MouseEvent) {
    e.stopPropagation();
    setBusy(true);
    try {
      await onActivate();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card text-left transition-colors hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <TemplateThumb url={previewUrl} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold">
            {t(`admin.home.templates.${template.key}.label`)}
          </h3>
          {isActive ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              <Check className="h-3 w-3" />
              {t("admin.home.live")}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t(`admin.home.templates.${template.key}.description`)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Pencil className="mr-2 h-4 w-4" />
            {t("admin.home.edit")}
          </Button>
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("admin.home.preview")}
            </a>
          ) : null}
          {isActive ? null : (
            <Button type="button" className="ml-auto" onClick={activate} disabled={busy}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t("admin.home.setMain")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
