import { useTranslation } from "react-i18next";

export const inputCls =
  "min-h-11 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground outline-none transition-colors duration-300 focus:border-foreground";
const labelCls = "eyebrow block text-muted-foreground";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string };

export function Field({ id, label, ...rest }: FieldProps) {
  return (
    <div>
      <label className={labelCls} htmlFor={id}>{label}</label>
      <input id={id} className={inputCls} {...rest} />
    </div>
  );
}

/** Step 1: what and where. Type and street are required to value anything. */
export function PropertyStep({ address, type }: { address?: string; type?: string }) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-7 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={labelCls} htmlFor="val-type">{t("inquiry.seller.property_type")}</label>
        <select id="val-type" name="property_type" required className={inputCls} defaultValue={type ?? ""}>
          <option value="" disabled>{t("pages.valuation.wizard.choose")}</option>
          <option value="house">{t("listings.filters.house")}</option>
          <option value="apartment">{t("listings.filters.apartment")}</option>
          <option value="multi_family">{t("home.hero_form_multi_family")}</option>
          <option value="land">{t("listings.filters.land")}</option>
          <option value="commercial">{t("listings.filters.commercial")}</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <Field id="val-street" name="address_street" required defaultValue={address} autoComplete="street-address" maxLength={160} label={t("inquiry.seller.address_street")} />
      </div>
      <Field id="val-zip" name="address_zip" autoComplete="postal-code" inputMode="numeric" maxLength={16} label={t("inquiry.seller.address_zip")} />
      <Field id="val-city" name="address_city" autoComplete="address-level2" maxLength={120} label={t("inquiry.seller.address_city")} />
    </div>
  );
}

/** Step 2: optional facts and photos. Nothing here blocks progress. */
export function DetailsStep({ files, tooLarge, onFiles }: { files: number; tooLarge: boolean; onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-7 md:grid-cols-3">
      <Field id="val-area" name="living_area" type="number" min="0" max="100000" inputMode="decimal" label={t("inquiry.seller.living_area")} />
      <Field id="val-rooms" name="rooms" type="number" min="0" max="200" step="0.5" inputMode="decimal" label={t("inquiry.seller.rooms")} />
      <Field id="val-year" name="year_built" type="number" min="1500" max="2100" inputMode="numeric" label={t("inquiry.seller.year_built")} />
      <div className="md:col-span-3">
        <Field id="val-condition" name="condition" maxLength={120} label={t("inquiry.seller.condition")} />
      </div>
      <div className="md:col-span-3">
        <label className={labelCls} htmlFor="val-photos">{t("inquiry.seller.photos")}</label>
        <input id="val-photos" name="photos" type="file" accept="image/*" multiple onChange={onFiles} aria-describedby="val-photos-status" className="mt-3 block w-full text-sm text-muted-foreground file:mr-4 file:min-h-11 file:border-0 file:bg-primary file:px-4 file:text-primary-foreground" />
        <div id="val-photos-status" aria-live="polite" className="mt-2 text-xs">
          {tooLarge ? <span className="text-destructive">{t("inquiry.seller.photo_too_large")}</span>
            : files > 0 ? <span className="text-muted-foreground">{t("inquiry.seller.photos_selected").replace("{{n}}", String(files))}</span> : null}
        </div>
      </div>
    </div>
  );
}

/** Step 3: how to reach the owner. */
export function ContactStep() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-7 md:grid-cols-2">
      <Field id="val-name" name="name" required autoComplete="name" maxLength={100} label={t("inquiry.name")} />
      <Field id="val-email" name="email" type="email" required autoComplete="email" maxLength={255} label={t("inquiry.email")} />
      <Field id="val-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} label={t("inquiry.phone")} />
      <div className="md:col-span-2">
        <label className={labelCls} htmlFor="val-message">{t("inquiry.message")}</label>
        <textarea id="val-message" name="message" rows={3} maxLength={2000} className={`${inputCls} resize-none`} />
      </div>
    </div>
  );
}
