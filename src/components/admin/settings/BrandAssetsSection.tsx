import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  siteSettingsQueryOptions,
  updateSiteSettings,
} from "@/lib/config/site-settings.functions";

import { BrandAssetField } from "./BrandAssetField";

type Assets = {
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  og_default_image: string | null;
  logo_size: number;
};

/**
 * The brand images. Saved the moment one changes, because an upload is already
 * a deliberate action — there is nothing to confirm afterwards.
 */
export function BrandAssetsSection() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(siteSettingsQueryOptions);
  const [saving, setSaving] = useState(false);

  const current: Assets = {
    logo_url: data.logo_url,
    logo_dark_url: data.logo_dark_url,
    favicon_url: data.favicon_url,
    og_default_image: data.og_default_image,
    logo_size: data.logo_size ?? 100,
  };

  async function set(key: keyof Assets, value: string | number | null) {
    setSaving(true);
    try {
      await updateSiteSettings({
        data: { tab: "brand_assets", values: { ...current, [key]: value } },
      });
      await qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
      toast.success(t("admin.settings.saved"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("admin.settings.saveError"));
    } finally {
      setSaving(false);
    }
  }

  const label = (key: string) => t(`admin.settings.brand.${key}`);

  return (
    <section
      className={`grid gap-6 sm:grid-cols-2 ${saving ? "opacity-70" : ""}`}
      aria-busy={saving}
    >
      <BrandAssetField
        kind="logo"
        label={label("logo")}
        help={label("logoHelp")}
        value={current.logo_url}
        onChange={(url) => void set("logo_url", url)}
      />
      <div className="space-y-3 rounded-[0.875rem] border border-border bg-card p-5 sm:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">{label("size")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label("sizeHelp")}</p>
          </div>
          <span className="tabular-figures text-sm font-semibold">{current.logo_size}%</span>
        </div>
        <input
          type="range"
          min="60"
          max="140"
          step="5"
          value={current.logo_size}
          disabled={saving}
          aria-label={label("size")}
          className="w-full accent-primary"
          onChange={(event) => void set("logo_size", Number(event.target.value))}
        />
      </div>
      <BrandAssetField
        kind="logo_dark"
        label={label("logoDark")}
        help={label("logoDarkHelp")}
        value={current.logo_dark_url}
        onChange={(url) => void set("logo_dark_url", url)}
        dark
      />
      <BrandAssetField
        kind="favicon"
        label={label("favicon")}
        help={label("faviconHelp")}
        value={current.favicon_url}
        onChange={(url) => void set("favicon_url", url)}
        square
      />

      <BrandAssetField
        kind="og_default"
        label={label("ogImage")}
        help={label("ogImageHelp")}
        value={current.og_default_image}
        onChange={(url) => void set("og_default_image", url)}
      />
    </section>
  );
}
