import { useTranslation } from "react-i18next";

import { Switch } from "@/components/ui/switch";
import type { ListingFormApi } from "./listing-form-state";
import { MoneyField } from "./MoneyField";

/**
 * "Price reduced" puts one badge on the public card. The earlier price is kept
 * for the broker's own reference only and is never published, so the site
 * makes no strike-through price claim it would have to prove.
 */
export function PriceReductionFields({
  form,
  symbol,
}: {
  form: ListingFormApi;
  symbol: string;
}) {
  const { t } = useTranslation();
  const { values } = form;
  const on = !!values.price_reduced;

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2 text-sm">
        <span className="space-y-0.5">
          <span className="block">{t("admin.listings.fields.price_reduced")}</span>
          <span className="block text-xs text-muted-foreground">
            {t("admin.listings.help.price_reduced")}
          </span>
        </span>
        <Switch
          checked={on}
          onCheckedChange={(checked) => form.setField("price_reduced", checked)}
          aria-label={t("admin.listings.fields.price_reduced")}
        />
      </label>
      {on ? (
        <MoneyField
          label={t("admin.listings.fields.previous_price")}
          help={t("admin.listings.help.previous_price")}
          symbol={symbol}
          value={values.previous_price}
          onChange={(v) => form.setField("previous_price", v)}
        />
      ) : null}
    </div>
  );
}
