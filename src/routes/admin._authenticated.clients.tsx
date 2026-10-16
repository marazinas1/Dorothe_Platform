import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

import { usePublicLocale } from "@/lib/config/use-public-locale";
import { adminInquiriesQueryOptions } from "@/lib/inquiries/admin.functions";
import { groupClients } from "@/lib/inquiries/clients";
import { ClientsList } from "@/components/admin/inquiries/ClientsList";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export const Route = createFileRoute("/admin/_authenticated/clients")({
  staticData: { sitemap: false },
  component: ClientsPage,
});

function ClientsPage() {
  const { t } = useTranslation();
  const locale = usePublicLocale();
  const { data } = useSuspenseQuery(adminInquiriesQueryOptions);

  return (
    <div className="space-y-6">
      <AdminPageHeader icon={Users} title={t("admin.clients.title")} description={t("admin.clients.subtitle")} />
      <ClientsList clients={groupClients(data)} locale={locale} />
    </div>
  );
}
