import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  siteSettingsQueryOptions,
  updateSiteSettings,
} from "@/lib/config/site-settings.functions";

import { BrandAssetField } from "./BrandAssetField";
import { LogoSizeField } from "./LogoSizeField";

type Assets = {
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  business_card_url: string | null;
  og_default_image: string | null;
  logo_size: number;
};

/**
 * The brand files. Saved the moment one changes, because an upload or a size
 * choice is already a deliberate action — there is nothing to confirm after.
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
    business_card_url: data.business_card_url ?? null,
    og_default_image: data.og_default_image,
    logo_size: data.logo_size ?? 100,
  };

  const [size, setSize] = useState(current.logo_size);
  useEffect(() => setSize(data.logo_size ?? 100), [data.logo_size]);

  async function set(key: keyof Assets, value: string | number | null) {
    setSaving(true);
    try {
      await updateSiteSettings({
        data: { tab: "brand_assets", values: { ...current, [key]: value } },
      });
      await qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
      toast.success(t("admin.settings.saved"));
    } catch (e) {
      if (key === "logo_size") setSize(current.logo_size);
      toast.error(e instanceof Error ? e.message : t("admin.settings.saveError"));
    } finally {
      setSaving(false);
    }
  }

  const slug = data.site_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "site";
  const label = (key: string) => t(`admin.settings.brand.${key}`);

  return (
    <div className={`space-y-6 ${saving ? "opacity-70" : ""}`} aria-busy={saving}>
      <section className="grid gap-6 sm:grid-cols-3">
        <BrandAssetField
          kind="logo"
          label={label("logo")}
          help={label("logoHelp")}
          value={current.logo_url}
          downloadName={`${slug}-logo.webp`}
          onChange={(url) => void set("logo_url", url)}
        />
        <BrandAssetField
          kind="logo_dark"
          label={label("logoDark")}
          help={label("logoDarkHelp")}
          value={current.logo_dark_url}
          downloadName={`${slug}-logo-dark.webp`}
          onChange={(url) => void set("logo_dark_url", url)}
          dark
        />
        <BrandAssetField
          kind="favicon"
          label={label("favicon")}
          help={label("faviconHelp")}
          value={current.favicon_url}
          downloadName={`${slug}-favicon.webp`}
          onChange={(url) => void set("favicon_url", url)}
          square
        />
      </section>

      <LogoSizeField
        value={size}
        onChange={setSize}
        onCommit={(next) => void set("logo_size", next)}
        disabled={saving}
      />

      {/* The business card is a print asset, not site chrome, so it sits apart. */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BrandAssetField
          kind="logo"
          label={label("businessCard")}
          help={label("businessCardHelp")}
          value={current.business_card_url}
          downloadName={`${slug}-business-card.pdf`}
          onChange={(url) => void set("business_card_url", url)}
          document
          pathForVariant={() => `brand/${data.id}/business-card.pdf`}
        />
      </section>
    </div>
  );
}
