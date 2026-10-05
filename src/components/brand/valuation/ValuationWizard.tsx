import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/brand/ui/Button";
import { ConsentCheckbox } from "@/components/public/ConsentCheckbox";
import { fileToBase64, numOrNull } from "@/lib/inquiry/file-base64";
import { submitSellerInquiry } from "@/lib/inquiry/submit.functions";
import { useConsent } from "@/lib/inquiry/use-consent";
import { cn } from "@/lib/utils";
import { ContactStep, DetailsStep, PropertyStep } from "./ValuationSteps";

const MAX_PHOTOS = 4;
const MAX_BYTES = 3 * 1024 * 1024;
const STEPS = 3;

/**
 * Three short steps instead of one long form (property → details → contact).
 * Every field stays mounted, so going back never loses input; each step is
 * validated before moving on, and focus moves to the new step's heading.
 */
export function ValuationWizard({ address, type }: { address?: string; type?: string }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [tooLarge, setTooLarge] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const consent = useConsent();
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titles = [t("pages.valuation.wizard.step1"), t("pages.valuation.wizard.step2"), t("pages.valuation.wizard.step3")];

  const stepValid = () => {
    const group = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const fields = Array.from(group?.querySelectorAll<HTMLInputElement>("input,select,textarea") ?? []);
    const bad = fields.find((f) => !f.checkValidity());
    if (bad) bad.reportValidity();
    return !bad;
  };
  const go = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS);
    const big = list.some((f) => f.size > MAX_BYTES);
    setTooLarge(big);
    setFiles(big ? [] : list);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS) {
      if (stepValid()) go(step + 1);
      return;
    }
    if (!stepValid() || !consent.check()) return;
    const fd = new FormData(e.currentTarget);
    const str = (k: string) => String(fd.get(k) ?? "");
    setStatus("submitting");
    try {
      const photos = await Promise.all(files.map(async (f) => ({ filename: f.name, content_type: f.type || "application/octet-stream", data_base64: await fileToBase64(f) })));
      await submitSellerInquiry({
        data: {
          name: str("name"), email: str("email"), phone: str("phone"), message: str("message"),
          property_type: str("property_type"), address_street: str("address_street"),
          address_zip: str("address_zip"), address_city: str("address_city"),
          living_area: numOrNull(fd.get("living_area")), rooms: numOrNull(fd.get("rooms")),
          year_built: numOrNull(fd.get("year_built")), condition: str("condition"),
          photos: photos.length ? photos : undefined, consent: true, locale: consent.locale, source: "valuation",
        },
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="py-6">
        <h2 className="font-heading text-2xl font-bold">{t("pages.valuation.wizard.done_title")}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("inquiry.success")}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={t("pages.valuation.form_title")}>
      <ol className="mb-7 flex gap-2" aria-label={t("pages.valuation.wizard.progress", { n: step, total: STEPS })}>
        {titles.map((title, i) => (
          <li key={title} className={cn("h-1 flex-1", i < step ? "bg-foreground" : "bg-border")}>
            <span className="sr-only">{title}</span>
          </li>
        ))}
      </ol>
      <div className="eyebrow text-muted-foreground" aria-live="polite">{t("pages.valuation.wizard.progress", { n: step, total: STEPS })}</div>
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 font-heading text-2xl font-bold outline-none">{titles[step - 1]}</h2>

      <div className="mt-8">
        <div data-step="1" hidden={step !== 1}><PropertyStep address={address} type={type} /></div>
        <div data-step="2" hidden={step !== 2}><DetailsStep files={files.length} tooLarge={tooLarge} onFiles={onFiles} /></div>
        <div data-step="3" hidden={step !== 3}>
          <ContactStep />
          <div className="mt-7">
            <ConsentCheckbox id="val-consent" checked={consent.given} onChange={consent.set} showError={consent.error} />
          </div>
        </div>
      </div>

      {status === "error" ? <div role="alert" className="mt-6 text-sm text-destructive">{t("inquiry.error")}</div> : null}

      <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={() => go(step - 1)}>{t("pages.valuation.wizard.back")}</Button>
        ) : <span />}
        <Button type="submit" variant="primary" loading={status === "submitting"}>
          {step < STEPS ? t("pages.valuation.wizard.next") : status === "submitting" ? t("inquiry.submitting") : t("inquiry.seller.submit")}
        </Button>
      </div>
    </form>
  );
}
