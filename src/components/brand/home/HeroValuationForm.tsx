import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/brand/ui/Button";
import type { Locale } from "@/i18n/config";

const TYPES = ["house", "apartment", "multi_family", "land"] as const;
const field =
  "min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Seller entry in the hero: collects address and type only, then hands both to
 * the valuation page in the same locale. Nothing is submitted from here.
 */
export function HeroValuationForm({ locale, title }: { locale: Locale; title: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const typeLabel = (v: (typeof TYPES)[number]) =>
    v === "house" ? t("home.hero_form_house")
      : v === "apartment" ? t("home.hero_form_apartment")
      : v === "multi_family" ? t("home.hero_form_multi_family")
      : t("home.hero_form_land");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const address = String(form.get("address") ?? "").trim().slice(0, 160);
    const type = String(form.get("type") ?? "");
    navigate({
      to: "/$locale/immobilienbewertung",
      params: { locale },
      search: { address: address || undefined, type: type || undefined },
    });
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 bg-background p-5 text-foreground md:p-6">
      <h2 className="font-heading text-base font-bold">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
        <div>
          <label htmlFor="hero-address" className="eyebrow mb-2 block text-muted-foreground">{t("home.hero_form_address")}</label>
          <input id="hero-address" name="address" autoComplete="street-address" maxLength={160} placeholder={t("home.hero_form_address_hint")} className={field} />
        </div>
        <div>
          <label htmlFor="hero-type" className="eyebrow mb-2 block text-muted-foreground">{t("home.hero_form_type")}</label>
          <select id="hero-type" name="type" defaultValue="house" className={field}>
            {TYPES.map((v) => <option key={v} value={v}>{typeLabel(v)}</option>)}
          </select>
        </div>
        <Button type="submit" variant="primary">{t("home.hero_form_submit")}</Button>
      </div>
    </form>
  );
}
