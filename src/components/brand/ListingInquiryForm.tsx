import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ConsentCheckbox } from "@/components/public/ConsentCheckbox";
import { useConsent } from "@/lib/inquiry/use-consent";

import { submitInquiry } from "@/lib/inquiry/submit.functions";
import { Button } from "@/components/brand/ui/Button";

type Props = {
  listingId: string;
  defaultMessage?: string;
};

const inputCls =
  "mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none transition-colors duration-150 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring/30";
const labelCls =
  "block text-sm font-medium text-foreground";

/** Listing-specific inquiry form used on the detail page. */
export function ListingInquiryForm({ listingId, defaultMessage }: Props) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const consent = useConsent();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!consent.check()) return;
    setStatus("submitting");
    try {
      await submitInquiry({
        data: {
          listing_id: listingId,
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          message: String(fd.get("message") ?? ""),
          consent: true,
          locale: consent.locale,
        },
      });
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border-t border-border pt-10 text-sm text-foreground">
        {t("inquiry.success")}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="font-heading text-2xl md:text-3xl">{t("inquiry.title")}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{t("inquiry.subtitle")}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="inq-name">{t("inquiry.name")}</label>
          <input id="inq-name" name="name" required autoComplete="name" maxLength={100} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="inq-email">{t("inquiry.email")}</label>
          <input id="inq-email" name="email" type="email" required autoComplete="email" maxLength={255} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="inq-phone">{t("inquiry.phone")} <span className="font-normal text-muted-foreground">({t("inquiry.optional")})</span></label>
          <input id="inq-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="inq-message">{t("inquiry.message")}</label>
          <textarea
            id="inq-message"
            name="message"
            required
            rows={4}
            maxLength={2000}
            defaultValue={defaultMessage ?? t("inquiry.message_default")}
            className={`${inputCls} resize-y`}
          />
        </div>
      </div>

      <div className="mt-8">
        <ConsentCheckbox
          id="inq-consent"
          checked={consent.given}
          onChange={consent.set}
          showError={consent.error}
        />
      </div>

      {status === "error" ? (
        <div role="alert" aria-live="polite" className="mt-4 text-sm text-destructive">{t("inquiry.error")}</div>
      ) : null}

      <Button
        type="submit"
        loading={status === "submitting"}
        className="mt-8 w-full sm:w-auto"
      >
        {status === "submitting" ? t("inquiry.submitting") : t("inquiry.submit")}
      </Button>
    </form>
  );
}
