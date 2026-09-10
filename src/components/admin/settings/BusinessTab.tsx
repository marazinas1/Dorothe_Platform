import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { geocodeAddress } from "@/lib/geo/geocode.functions";
import {
  siteSettingsQueryOptions,
  updateSiteSettings,
} from "@/lib/config/site-settings.functions";
import { GeneralSchema, ContactSchema } from "@/lib/validation/site-settings";
import { usePermission } from "@/lib/auth/use-permission";
import type { SiteSettings } from "@/types/site-settings";

import { SaveButton } from "./SaveButton";
import { BrandAssetsSection } from "./BrandAssetsSection";
import { OpeningHoursField } from "./OpeningHoursField";
import { SocialLinksField } from "./SocialLinksField";
import { TechnicalBlock } from "./TechnicalBlock";
import { SettingsField as Field } from "./SettingsField";

type State = {
  site_name: string;
  legal_name: string;
  service_region: Record<string, string>;
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  address_street: string;
  address_zip: string;
  address_city: string;
  address_country: string;
  geo_lat: string;
  geo_lng: string;
  opening_hours: Record<string, unknown>;
  social: Record<string, unknown>;
};

function toState(data: SiteSettings): State {
  return {
    site_name: data.site_name,
    legal_name: data.legal_name ?? "",
    service_region: { ...(data.service_region ?? {}) },
    contact_email: data.contact_email ?? "",
    contact_phone: data.contact_phone ?? "",
    whatsapp: data.whatsapp ?? "",
    address_street: data.address_street ?? "",
    address_zip: data.address_zip ?? "",
    address_city: data.address_city ?? "",
    address_country: data.address_country ?? "",
    geo_lat: data.geo_lat != null ? String(data.geo_lat) : "",
    geo_lng: data.geo_lng != null ? String(data.geo_lng) : "",
    opening_hours: (data.opening_hours ?? {}) as Record<string, unknown>,
    social: (data.social ?? {}) as Record<string, unknown>,
  };
}

/**
 * The everyday business settings in one place: brand images, name, contact
 * details, office address with map pin, opening hours and social links.
 * Technical platform values (country, locales, currency, area unit) are fixed
 * for this client and only surface for the developer below.
 */
export function BusinessTab() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(siteSettingsQueryOptions);
  const canDesign = usePermission("design.edit");

  const [form, setForm] = useState<State>(() => toState(data));
  useEffect(() => setForm(toState(data)), [data]);

  const set = <K extends keyof State>(key: K, next: State[K]) =>
    setForm((prev) => ({ ...prev, [key]: next }));

  const locales = data.enabled_locales?.length
    ? data.enabled_locales
    : [data.default_locale];

  async function save() {
    GeneralSchema.parse({
      site_name: form.site_name,
      legal_name: form.legal_name,
      country: data.country,
      default_locale: data.default_locale,
      enabled_locales: data.enabled_locales,
      service_region: form.service_region,
      currency: data.currency,
      area_unit: data.area_unit,
    });
    await updateSiteSettings({
      data: {
        tab: "general",
        values: {
          site_name: form.site_name,
          legal_name: form.legal_name,
          country: data.country,
          default_locale: data.default_locale,
          enabled_locales: data.enabled_locales,
          service_region: form.service_region,
          currency: data.currency,
          area_unit: data.area_unit,
        },
      },
    });
    // The map pin follows the address: coordinates are looked up on save, so the
    // panel never asks for latitude and longitude.
    let geo = { geo_lat: form.geo_lat, geo_lng: form.geo_lng };
    const addressChanged =
      form.address_street !== (data.address_street ?? "") ||
      form.address_zip !== (data.address_zip ?? "") ||
      form.address_city !== (data.address_city ?? "") ||
      form.address_country !== (data.address_country ?? "");
    if (addressChanged || (!form.geo_lat && !form.geo_lng)) {
      const found = await geocodeAddress({
        data: {
          street: form.address_street,
          zip: form.address_zip,
          city: form.address_city,
          country: form.address_country,
        },
      });
      if (found.ok) geo = { geo_lat: String(found.lat), geo_lng: String(found.lng) };
    }
    await updateSiteSettings({
      data: { tab: "contact", values: ContactSchema.parse({ ...form, ...geo }) },
    });
    await qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">{t("admin.settings.business.identity")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("admin.settings.general.site_name")}>
            <Input value={form.site_name} onChange={(e) => set("site_name", e.target.value)} />
          </Field>
          <Field label={t("admin.settings.general.legal_name")}>
            <Input value={form.legal_name} onChange={(e) => set("legal_name", e.target.value)} />
          </Field>
          {locales.map((loc) => (
            <Field
              key={loc}
              label={`${t("admin.settings.business.region_name")} (${loc.toUpperCase()})`}
              help={t("admin.settings.general.service_region_help")}
            >
              <Input
                value={form.service_region[loc] ?? ""}
                onChange={(e) =>
                  set("service_region", { ...form.service_region, [loc]: e.target.value })
                }
              />
            </Field>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">{t("admin.settings.business.contact")}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t("admin.settings.contact.contact_email")}>
            <Input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
          </Field>
          <Field label={t("admin.settings.contact.contact_phone")}>
            <Input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
          </Field>
          <Field label={t("admin.settings.contact.whatsapp")}>
            <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("admin.settings.contact.address_street")}>
            <Input value={form.address_street} onChange={(e) => set("address_street", e.target.value)} />
          </Field>
          <Field label={t("admin.settings.contact.address_zip")}>
            <Input value={form.address_zip} onChange={(e) => set("address_zip", e.target.value)} />
          </Field>
          <Field label={t("admin.settings.contact.address_city")}>
            <Input value={form.address_city} onChange={(e) => set("address_city", e.target.value)} />
          </Field>
          <Field label={t("admin.settings.contact.address_country")}>
            <Input value={form.address_country} onChange={(e) => set("address_country", e.target.value)} />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("admin.settings.contact.map_help")}
        </p>
      </section>

      <OpeningHoursField
        value={form.opening_hours}
        onChange={(next) => set("opening_hours", next)}
      />
      <SocialLinksField value={form.social} onChange={(next) => set("social", next)} />

      <SaveButton onSubmit={save} />

      <BrandAssetsSection />

      {canDesign ? <TechnicalBlock data={data} /> : null}
    </div>
  );
}

