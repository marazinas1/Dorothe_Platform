import { useTranslation } from "react-i18next";

import { StatusChip } from "@/components/admin/ui/StatusChip";
import { inquiryTypeKey, type InquiryStatus } from "@/lib/inquiries/types";

export function InquiryTypeBadge({ type }: { type: string }) {
  const { t } = useTranslation();
  return (
    <StatusChip icon="type">{t(`admin.inquiries.types.${inquiryTypeKey(type)}`)}</StatusChip>
  );
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const { t } = useTranslation();
  const icon = status === "new" ? "unread" : status === "handled" ? "published" : "read";
  return (
    <StatusChip icon={icon} tone={status === "new" ? "active" : "muted"}>
      {t(`admin.inquiries.status.${status}`)}
    </StatusChip>
  );
}

export function formatInquiryDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
