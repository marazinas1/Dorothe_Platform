import { useTranslation } from "react-i18next";

import { ListingInquiryForm } from "@/components/brand/ListingInquiryForm";
import { agentPortraitIfSet } from "@/lib/media/slots";
import type { SiteSettings } from "@/types/site-settings";

type Props = {
  listingId: string;
  settings: SiteSettings;
};

/**
 * Responsible-agent block on the detail page. Portrait + name + role + direct
 * contact, with the enquiry form immediately alongside so buyers do not have
 * to navigate to a separate contact page.
 */
export function ListingAgent({ listingId, settings }: Props) {
  const { t } = useTranslation();
  const name = settings.primary_agent_name ?? settings.legal_name ?? settings.site_name;
  const role = settings.primary_agent_role ?? "";
  const photo = agentPortraitIfSet(settings);
  const phone = settings.contact_phone;
  const email = settings.contact_email;

  return (
    <section className="border-t border-border pt-10">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <div className="flex items-start gap-6">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="h-36 w-36 flex-none object-cover grayscale"
              />
            ) : null}
            <div className="min-w-0">
              <div className="font-heading text-3xl font-bold leading-tight md:text-4xl">{name}</div>
              {role ? (
                <div className="mt-2 text-sm text-muted-foreground">{role}</div>
              ) : null}
              <dl className="mt-6 space-y-2 text-sm">
                {phone ? (
                  <div className="flex items-baseline gap-4">
                    <dt className="w-16 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
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
                {email ? (
                  <div className="flex items-baseline gap-4">
                    <dt className="w-16 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t("contact.email")}
                    </dt>
                    <dd>
                      <a href={`mailto:${email}`} className="text-foreground hover:underline">
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
          <ListingInquiryForm listingId={listingId} />
        </div>
      </div>
    </section>
  );
}
