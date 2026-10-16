import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { suggestGermanEnergyClass } from "@/lib/listings/energy-scale";

/**
 * Non-binding class suggestion for Germany only. The broker always confirms;
 * other markets use different scales, so nothing is suggested there.
 */
export function EnergyClassHint(props: {
  country: string;
  finalEnergy: unknown;
  current: unknown;
  onUse: (cls: string) => void;
}) {
  const { t } = useTranslation();
  if (props.country !== "DE") return null;
  const cls = suggestGermanEnergyClass(props.finalEnergy);
  if (!cls || props.current === cls) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>{t("admin.listings.energy.classHint", { value: props.finalEnergy, cls })}</span>
      <Button type="button" size="sm" variant="outline" onClick={() => props.onUse(cls)}>
        {t("admin.listings.energy.classHintUse", { cls })}
      </Button>
    </div>
  );
}
