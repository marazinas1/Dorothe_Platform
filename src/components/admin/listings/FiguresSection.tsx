import { Euro, Ruler } from "lucide-react";
import { useTranslation } from "react-i18next";

import { fieldsAtLevel } from "@/lib/listings/field-visibility";
import type { ListingFormApi } from "./listing-form-state";
import { FormSection } from "./FieldRow";
import { PriceGroup } from "./PriceGroup";
import { NUMERIC_KEYS, NumberFields } from "./NumberFields";
import { TenancyFields } from "./TenancyFields";

/**
 * Money and terms: price, running costs, commission and tenancy. Kept apart
 * from measurements because a broker thinks of them as a different question.
 */
export function PriceSection({ form }: { form: ListingFormApi }) {
  const { t } = useTranslation();
  return (
    <FormSection icon={Euro} anchor="price" title={t("admin.listings.sections.price")}>
      <div className="grid gap-8">
        <PriceGroup form={form} />
        <TenancyFields form={form} level="open" />
      </div>
    </FormSection>
  );
}

/**
 * Measurements and rooms. Which appear depends on the property type — a plot
 * has no rooms, a commercial unit has commercial area instead of living area.
 * Returns null when the type has none, so the nav skips it too.
 */
export function SizeSection({ form }: { form: ListingFormApi }) {
  const { t } = useTranslation();
  const shape = {
    property_type: form.values.property_type,
    deal_type: form.values.deal_type,
  };
  const openNumbers = fieldsAtLevel(shape, NUMERIC_KEYS, "open");
  return (
    <FormSection
      icon={Ruler}
      title={t("admin.listings.sections.size")}
      description={t("admin.listings.help.size_section")}
    >
      <NumberFields form={form} keys={openNumbers} />
    </FormSection>
  );
}

export function hasSizeFields(shape: { property_type: string; deal_type: string }): boolean {
  return fieldsAtLevel(shape, NUMERIC_KEYS, "open").length > 0;
}
