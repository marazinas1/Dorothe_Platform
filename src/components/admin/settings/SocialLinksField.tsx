import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NETWORKS = ["facebook", "linkedin", "instagram"] as const;

type Props = {
  value: Record<string, unknown>;
  onChange: (next: Record<string, string>) => void;
};

/**
 * One URL field per social network instead of raw JSON. Empty fields are
 * dropped, so the footer only ever shows icons that have a real link.
 */
export function SocialLinksField({ value, onChange }: Props) {
  const { t } = useTranslation();

  const get = (k: string) => {
    const v = value?.[k];
    return typeof v === "string" ? v : "";
  };

  function set(k: string, next: string) {
    const out: Record<string, string> = {};
    for (const n of NETWORKS) {
      const cur = n === k ? next : get(n);
      if (cur.trim()) out[n] = cur.trim();
    }
    onChange(out);
  }

  return (
    <div className="space-y-1.5">
      <Label>{t("admin.settings.social.title")}</Label>
      <div className="grid gap-3 sm:grid-cols-3">
        {NETWORKS.map((n) => (
          <div key={n} className="space-y-1">
            <span className="text-xs text-muted-foreground">
              {t(`admin.settings.social.${n}`)}
            </span>
            <Input
              type="url"
              placeholder="https://…"
              value={get(n)}
              onChange={(e) => set(n, e.target.value)}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t("admin.settings.social.help")}</p>
    </div>
  );
}
