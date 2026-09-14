import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Building2, CalendarPlus, FilePlus2, MailOpen } from "lucide-react";

import { AdminSection } from "@/components/admin/ui/AdminSection";

const ACTIONS = [
  { key: "property", to: "/$locale/admin/listings/new", icon: Building2 },
  { key: "inquiries", to: "/$locale/admin/inquiries", icon: MailOpen },
  { key: "appointment", to: "/$locale/admin/calendar", icon: CalendarPlus },
  { key: "article", to: "/$locale/admin/posts", icon: FilePlus2 },
] as const;

export function QuickActions({ locale }: { locale: string }) {
  const { t } = useTranslation();
  return (
    <AdminSection title={t("admin.dashboard.quick.title")} description={t("admin.dashboard.quick.help")}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ACTIONS.map(({ key, to, icon: Icon }) => (
          <Link
            key={key}
            to={to}
            params={{ locale }}
            className="group flex min-h-24 flex-col justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/35 hover:bg-primary/5"
          >
            <Icon className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-5 text-sm font-semibold">{t(`admin.dashboard.quick.${key}`)}</span>
          </Link>
        ))}
      </div>
    </AdminSection>
  );
}