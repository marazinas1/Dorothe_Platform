import { useTranslation } from "react-i18next";

import { energyView, kwh, type EnergyCell } from "@/lib/listings/energy-display";
import { energyScale } from "@/lib/listings/energy-scale";

import { EnergyScaleBar } from "./EnergyScaleBar";

type Props = {
  energy: unknown;
  propertyType: string;
  exemption?: string | null;
  /** site_settings.country — the market decides which figures are disclosed. */
  country: string;
};

/**
 * Energy certificate panel. The fields are chosen per country in
 * src/lib/listings/energy-display.ts (GEG in Germany, EAVG in Austria, GEAK in
 * Switzerland); this component only renders what it is given.
 */
export function EnergyPanel({ energy, propertyType, exemption, country }: Props) {
  const { t, i18n } = useTranslation();
  const view = energyView({
    country,
    energy,
    propertyType,
    exemption,
    locale: i18n.language,
  });

  if (view.kind === "exempt") {
    if (!view.exemptionKey) return null;
    return (
      <Frame t={t}>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t(view.exemptionKey)}
        </p>
      </Frame>
    );
  }

  if (view.kind === "missing") {
    return (
      <Frame t={t}>
        <p className="mt-6 text-sm text-muted-foreground">
          {t("listings.detail.energy_missing")}
        </p>
      </Frame>
    );
  }

  const rawValue = (energy as Record<string, unknown> | null)?.["final_energy"];
  const scale = energyScale({
    country,
    energy,
    formattedValue: typeof rawValue === "number" ? kwh(rawValue, i18n.language) : null,
  });
  const cells: EnergyCell[] = view.efficiencyClass
    ? [...view.cells.slice(0, 2), { labelKey: "listings.detail.energy_fields.efficiency_class", value: view.efficiencyClass }, ...view.cells.slice(2)]
    : view.cells;

  return (
    <Frame t={t}>
      <div className="mt-[18px] rounded-media border border-border p-7">
        {scale ? <EnergyScaleBar scale={scale} label={t("listings.detail.energy_scale")} /> : null}
        <dl className={`grid grid-cols-2 gap-[18px] text-[15.5px] sm:grid-cols-3 ${scale ? "mt-6" : ""}`}>
          {cells.map((cell) => (
            <div key={cell.labelKey}>
              <dt className="text-[13px] text-muted-foreground">{t(cell.labelKey)}</dt>
              <dd className="tabular-figures text-foreground">{cellValue(cell, t)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        {t(view.footnoteKey)}
      </p>
    </Frame>
  );
}

function cellValue(cell: EnergyCell, t: (key: string) => string): string {
  if (cell.valueKeys) return cell.valueKeys.map((k) => t(k)).join(", ");
  if (cell.valueKey) return t(cell.valueKey);
  return cell.value ?? "";
}

function Frame({
  t,
  children,
}: {
  t: (key: string) => string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
        {t("listings.detail.energy")}
      </h2>
      {children}
    </div>
  );
}
