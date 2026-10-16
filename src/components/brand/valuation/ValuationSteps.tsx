import { useTranslation } from "react-i18next";


import { FormField as Field, FormTextarea, fieldInputCls as inputCls, fieldLabelCls } from "@/components/brand/form/FormField";

export { inputCls };
const labelCls = fieldLabelCls;

/** Step 1: what and where. Type and street are required to value anything. */
export function PropertyStep({ address, type }: { address?: string; type?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex max-w-xl flex-col gap-5">
      <div>
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
      <div>
        <Field id="val-street" name="address_street" defaultValue={address} autoComplete="street-address" maxLength={160} label={t("inquiry.seller.address_street")} />
      </div>
      <Field id="val-zip" name="address_zip" optional autoComplete="postal-code" inputMode="numeric" maxLength={16} label={t("inquiry.seller.address_zip")} />
      <Field id="val-city" name="address_city" optional autoComplete="address-level2" maxLength={120} label={t("inquiry.seller.address_city")} />
    </div>
  );
}

/** Step 2: optional facts and photos. Nothing here blocks progress. */
export function DetailsStep({ files, tooLarge, onFiles }: { files: number; tooLarge: boolean; onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex max-w-xl flex-col gap-5">
      <Field id="val-area" name="living_area" optional type="number" min="0" max="100000" inputMode="decimal" label={t("inquiry.seller.living_area")} />
      <Field id="val-rooms" name="rooms" optional type="number" min="0" max="200" step="0.5" inputMode="decimal" label={t("inquiry.seller.rooms")} />
      <Field id="val-year" name="year_built" optional type="number" min="1500" max="2100" inputMode="numeric" label={t("inquiry.seller.year_built")} />
      <div>
        <Field id="val-condition" name="condition" optional maxLength={120} label={t("inquiry.seller.condition")} />
      </div>
      <div>
        <label className={labelCls} htmlFor="val-photos"><span>{t("inquiry.seller.photos")}</span><span className="text-xs font-normal text-muted-foreground">{t("form.optional")}</span></label>
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
    <div className="flex max-w-xl flex-col gap-5">
      <Field id="val-name" name="name" autoComplete="name" maxLength={100} label={t("inquiry.name")} />
      <Field id="val-email" name="email" type="email" autoComplete="email" maxLength={255} label={t("inquiry.email")} />
      <Field id="val-phone" name="phone" optional type="tel" autoComplete="tel" maxLength={40} label={t("pages.contact.form_phone")} />
      <div>
        <FormTextarea id="val-message" name="message" optional rows={3} maxLength={2000} label={t("inquiry.message")} />
      </div>
    </div>
  );
}
