import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { InquiriesList } from "@/components/admin/inquiries/InquiriesList";
import { adminInquiriesQueryOptions } from "@/lib/inquiries/admin.functions";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/$locale/admin/inquiries/")({
  staticData: { sitemap: false },
  component: InquiriesIndex,
});

function InquiriesIndex() {
  const { t } = useTranslation();
  const { locale } = Route.useParams();
  const { data } = useSuspenseQuery(adminInquiriesQueryOptions);
  const unread = data.filter((row) => row.status === "new").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader icon={Inbox} title={t("admin.pages.inquiries")} description={t("admin.inquiries.summary", { total: data.length, unread })} />
      <InquiriesList rows={data} locale={locale} />
    </div>
  );
}
