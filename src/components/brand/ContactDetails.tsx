import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { OfficeMap } from "@/components/brand/OfficeMap";
import type { DisplayHours } from "@/lib/config/opening-hours-display";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  settings: SiteSettings;
  hours: DisplayHours[];
};

function DetailRow({ icon, children, note }: { icon: React.ReactNode; children: React.ReactNode; note?: string }) {
  return (
    <div className="grid grid-cols-[20px_1fr] gap-4 border-b border-border py-6 first:pt-0">
      <span aria-hidden className="mt-0.5 text-foreground">{icon}</span>
      <div>
        <div className="font-semibold text-foreground">{children}</div>
        {note ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}

export function ContactDetails({ settings, hours }: Props) {
  const { t } = useTranslation();
  const address = [settings.address_street, [settings.address_zip, settings.address_city].filter(Boolean).join(" ")]
    .filter(Boolean);

  return (
    <div>
      {settings.contact_phone ? (
        <DetailRow icon={<Phone className="size-4" />} note={t("pages.contact.phone_note")}>
          <a className="tabular-figures hover:underline" href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}>
            {settings.contact_phone}
          </a>
        </DetailRow>
      ) : null}
      {settings.contact_email ? (
        <DetailRow icon={<Mail className="size-4" />} note={t("pages.contact.email_note")}>
          <a className="break-all hover:underline" href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
        </DetailRow>
      ) : null}
      {address.length > 0 ? (
        <DetailRow icon={<MapPin className="size-4" />} note={t("pages.contact.address_note")}>
          <address className="not-italic">{address.map((line) => <span key={line} className="block">{line}</span>)}</address>
        </DetailRow>
      ) : null}
      {hours.length > 0 ? (
        <DetailRow icon={<Clock3 className="size-4" />}>
          <span>{t("pages.contact.hours_title")}</span>
          <dl className="mt-3 space-y-2 font-normal">
            {hours.map((row) => (
              <div key={`${row.day}-${row.time}`} className="flex justify-between gap-5 text-sm">
                <dt className="text-muted-foreground">{row.day}</dt>
                <dd className="text-right tabular-figures">{row.time}</dd>
              </div>
            ))}
          </dl>
        </DetailRow>
      ) : null}
      <div className="mt-5"><OfficeMap settings={settings} /></div>
    </div>
  );
}