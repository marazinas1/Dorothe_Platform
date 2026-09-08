import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Eye, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HomeTemplateDef } from "@/lib/home/templates";

type Props = {
  template: HomeTemplateDef;
  isActive: boolean;
  onPreview: () => Promise<void>;
  onActivate: () => Promise<void>;
};

/**
 * One design in the gallery: its palette and typefaces at a glance, a preview
 * link, and the button that makes it the live home page.
 */
export function TemplateCard({ template, isActive, onPreview, onActivate }: Props) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState<"preview" | "activate" | null>(null);

  async function run(kind: "preview" | "activate", fn: () => Promise<void>) {
    setBusy(kind);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  }

  const theme = template.theme;
  const swatches = [theme.background_color, theme.primary_color, theme.accent_color, theme.secondary_color];

  return (
    <div className="flex flex-col rounded-[var(--radius)] border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold">
            {t(`admin.home.templates.${template.key}.label`)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(`admin.home.templates.${template.key}.description`)}
          </p>
        </div>
        {isActive ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            <Check className="h-3 w-3" />
            {t("admin.home.live")}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex gap-1.5" aria-hidden>
        {swatches.map((c) => (
          <span
            key={c}
            className="h-7 w-7 rounded-[calc(var(--radius)/2)] border border-border"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
        {theme.font_heading} · {theme.font_body}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={() => run("preview", onPreview)}>
          {busy === "preview" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Eye className="mr-2 h-4 w-4" />
          )}
          {t("admin.home.preview")}
        </Button>
        <Button
          type="button"
          onClick={() => run("activate", onActivate)}
          disabled={isActive || busy !== null}
        >
          {busy === "activate" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isActive ? t("admin.home.isMain") : t("admin.home.setMain")}
        </Button>
      </div>
    </div>
  );
}
