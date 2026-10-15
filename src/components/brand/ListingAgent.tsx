import { useTranslation } from "react-i18next";

import { ListingInquiryForm } from "@/components/brand/ListingInquiryForm";
import { agentPortraitIfSet } from "@/lib/media/slots";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  listingId: string;
  listingTitle: string;
  settings: SiteSettings;
};

/**
 * Responsible-agent block on the detail page. Portrait + name + role + direct
 * contact, with the enquiry form immediately alongside so buyers do not have
 * to navigate to a separate contact page.
 */
export function ListingAgent({ listingId, listingTitle, settings }: Props) {
  const { t } = useTranslation();
  const name = settings.primary_agent_name ?? settings.legal_name ?? settings.site_name;
  const role = settings.primary_agent_role ?? "";
  const photo = agentPortraitIfSet(settings);
  const phone = settings.contact_phone;
  const email = settings.contact_email;
  const wa = settings.whatsapp?.replace(/[^\d]/g, "");

  return (
    <section className="border border-border bg-card p-6 sm:p-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <div className="flex items-start gap-6">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="size-24 flex-none sm:size-32 object-cover grayscale"
              />
            ) : null}
            <div className="min-w-0">
              <div className="font-heading text-3xl font-bold leading-tight md:text-4xl">{name}</div>
              {role ? (
                <div className="mt-2 text-sm text-muted-foreground">{role}</div>
              ) : null}
              <dl className="mt-6 space-y-2 text-sm">
                {phone ? (
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t("contact.phone")}
                    </dt>
                    <dd>
                      <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="tabular-figures text-foreground hover:underline"
                      >
                        {phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {wa ? (
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t("share.whatsapp")}
                    </dt>
                    <dd>
                      <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="tabular-figures text-foreground hover:underline">
                        {settings.whatsapp}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {email ? (
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t("contact.email")}
                    </dt>
                    <dd>
                      <a href={`mailto:${email}`} className="break-words text-foreground hover:underline">
                        {email}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
        </div>
        <div>
          <ListingInquiryForm
            listingId={listingId}
            defaultMessage={t("inquiry.message_for_listing", { title: listingTitle })}
          />
        </div>
      </div>
    </section>
  );
}
