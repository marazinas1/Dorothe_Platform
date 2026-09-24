import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import type { ListingFormApi } from "./listing-form-state";
import { FieldRow } from "./FieldRow";

/**
 * SEO metadata is already inside the collapsed More details editor. Keeping
 * it unframed avoids nesting an editor card inside another editor card.
 */
export function SeoSection({ form, lang }: { form: ListingFormApi; lang: string }) {
  const { t } = useTranslation();
  const { values } = form;
  const suffix = ` (${lang.toUpperCase()})`;

  return (
    <section className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
      <h3 className="admin-section-title sm:col-span-2">{t("admin.listings.sections.seo")}</h3>
        <FieldRow
          label={t("admin.listings.fields.meta_title") + suffix}
          help={t("admin.listings.help.meta")}
        >
          <Input
            value={values.meta_title?.[lang] ?? ""}
            onChange={(e) => form.setTranslated("meta_title", lang, e.target.value)}
          />
        </FieldRow>
        <FieldRow label={t("admin.listings.fields.meta_description") + suffix}>
          <Input
            value={values.meta_description?.[lang] ?? ""}
            onChange={(e) => form.setTranslated("meta_description", lang, e.target.value)}
          />
        </FieldRow>
    </section>
  );
}
