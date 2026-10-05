import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/brand/ui/Button";
import { ConsentCheckbox } from "@/components/public/ConsentCheckbox";
import type { Locale } from "@/i18n/config";
import { submitBuyerInquiry, submitInquiry, submitSellerInquiry } from "@/lib/inquiry/submit.functions";
import { useConsent } from "@/lib/inquiry/use-consent";

export type ContactIntent = "selling" | "looking" | "other";
type Props = { initialIntent: ContactIntent; listingId?: string; listingTitle?: string; locale: Locale };
const input = "min-h-11 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground focus-visible:ring-2 focus-visible:ring-ring";
const label = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground";

export function ContactIntentForm({ initialIntent, listingId, listingTitle, locale }: Props) {
  const { t } = useTranslation();
  const [intent, setIntent] = useState<ContactIntent>(initialIntent);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const consent = useConsent();
  const tabs: ContactIntent[] = ["selling", "looking", "other"];
  const initialMessage = listingTitle
    ? t("inquiry.message_for_listing", { title: listingTitle })
    : t(`pages.contact.message_${intent}`);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent.check()) return;
    const form = new FormData(event.currentTarget);
    const common = {
      name: String(form.get("name") ?? ""), email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""), message: String(form.get("message") ?? ""),
      consent: true as const, locale: consent.locale,
    };
    setStatus("submitting");
    try {
      if (listingId) await submitInquiry({ data: { ...common, listing_id: listingId } });
      else if (intent === "selling") await submitSellerInquiry({ data: { ...common, address_city: String(form.get("city") ?? "") } });
      else await submitBuyerInquiry({ data: { ...common, city: String(form.get("city") ?? "") } });
      setStatus("success");
      event.currentTarget.reset();
    } catch { setStatus("error"); }
  };

  if (status === "success") return <div className="border-t border-border py-10 text-sm">{t("pages.contact.form_success")}</div>;

  return (
    <form onSubmit={onSubmit}>
      <div role="tablist" aria-label={t("pages.contact.form_title")} className="flex flex-wrap gap-x-8 border-b border-border">
        {tabs.map((value) => (
          <Button key={value} type="button" role="tab" aria-selected={intent === value} variant="ghost"
            onClick={() => setIntent(value)} className={`btn-noir h-12 border-0 px-0 ${intent === value ? "border-b-2 border-foreground" : "text-muted-foreground"}`}>
            {t(`pages.contact.intent_${value}`)}
          </Button>
        ))}
      </div>
      {listingTitle ? <p className="mt-6 border-l-2 border-foreground pl-4 text-sm font-semibold">{listingTitle}</p> : null}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" name="name" labelText={t("pages.contact.form_name")} autoComplete="name" required />
        <Field id="contact-email" name="email" type="email" labelText={t("pages.contact.form_email")} autoComplete="email" required />
        <div><Field id="contact-phone" name="phone" type="tel" labelText={t("pages.contact.form_phone")} autoComplete="tel" /><p className="mt-2 text-xs text-muted-foreground">{t("pages.contact.form_phone_note")}</p></div>
        <Field id="contact-city" name="city" labelText={t("pages.contact.form_city")} autoComplete="address-level2" />
      </div>
      <label className={`${label} mt-6`} htmlFor="contact-message">{t("pages.contact.form_message")}</label>
      <textarea key={`${intent}-${listingTitle ?? ""}`} id="contact-message" name="message" required rows={5} maxLength={4000} defaultValue={initialMessage} className={`${input} resize-y`} />
      <div className="mt-5"><ConsentCheckbox id="contact-consent" checked={consent.given} onChange={consent.set} showError={consent.error} /></div>
      {status === "error" ? <p role="alert" className="mt-4 text-sm text-destructive">{t("pages.contact.form_error")}</p> : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" loading={status === "submitting"}>{status === "submitting" ? t("pages.contact.form_submitting") : t("pages.contact.form_submit")}</Button>
        {intent === "selling" ? <Link to="/$locale/immobilienbewertung" params={{ locale }} className="btn-noir min-h-11 content-center underline underline-offset-[6px]">{t("pages.contact.valuation_instead")}</Link> : null}
      </div>
    </form>
  );
}

function Field({ id, labelText, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; labelText: string }) {
  return <div><label className={label} htmlFor={id}>{labelText}</label><input id={id} maxLength={255} className={input} {...props} /></div>;
}