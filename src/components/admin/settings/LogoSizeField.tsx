import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Slider } from "@/components/ui/slider";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { siteSettingsQueryOptions } from "@/lib/config/site-settings.functions";

type Props = {
  value: number;
  /** Live while dragging. */
  onChange: (next: number) => void;
  /** Once the handle is released, so one drag is one save. */
  onCommit: (next: number) => void;
  disabled?: boolean;
};

/**
 * One shared logo size for the public site, sign-in and this panel, shown next
 * to a live preview so the choice is visible before it is saved.
 */
export function LogoSizeField({ value, onChange, onCommit, disabled }: Props) {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery(siteSettingsQueryOptions);

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold">{t("admin.settings.brand.size")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("admin.settings.brand.sizeHelp")}
          </p>
        </div>
        <span className="text-sm font-semibold tabular-nums">{value}%</span>
      </div>

      <div className="mt-5 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)]">
        <Slider
          min={60}
          max={140}
          step={5}
          value={[value]}
          disabled={disabled}
          aria-label={t("admin.settings.brand.size")}
          onValueChange={([next]) => {
            if (next !== undefined) onChange(next);
          }}
          onValueCommit={([next]) => {
            if (next !== undefined) onCommit(next);
          }}
        />
        <div className="admin-media-frame flex h-28 items-center justify-center overflow-hidden px-4">
          <SiteLogo settings={{ ...data, logo_size: value }} />
        </div>
      </div>
    </section>
  );
}
