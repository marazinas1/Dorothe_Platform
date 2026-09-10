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
  };

  async function set(key: keyof Assets, url: string | null) {
    setSaving(true);
    try {
      await updateSiteSettings({
        data: { tab: "brand_assets", values: { ...current, [key]: url } },
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
      className={`grid max-w-3xl gap-6 sm:grid-cols-2 ${saving ? "opacity-70" : ""}`}
      aria-busy={saving}
    >
      <BrandAssetField
        kind="logo"
        label={label("logo")}
        help={label("logoHelp")}
        value={current.logo_url}
        onChange={(url) => void set("logo_url", url)}
      />
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
