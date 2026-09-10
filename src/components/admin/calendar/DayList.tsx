import { useTranslation } from "react-i18next";
import { Clock, MapPin, Phone, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/admin/ui/StatusChip";
import { pickLocalized } from "@/lib/listings/format";
import { shortTime, type AppointmentRow } from "@/lib/calendar/types";

interface Props {
  rows: AppointmentRow[];
  locale: string;
  onEdit: (row: AppointmentRow) => void;
  onDelete: (row: AppointmentRow) => void;
}

/** The chosen day, read top to bottom like a diary page. */
export function DayList({ rows, locale, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
        {t("admin.calendar.emptyDay")}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {rows.map((row) => (
        <li key={row.id} className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-sm font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {shortTime(row.start_time)}
              {row.end_time ? `–${shortTime(row.end_time)}` : ""}
            </span>
            <StatusChip icon="type">{t(`admin.calendar.kind.${row.kind}`)}</StatusChip>
            <StatusChip
              icon={row.status === "cancelled" ? "cancelled" : "confirmed"}
              tone={row.status === "cancelled" ? "muted" : "active"}
            >
              {t(`admin.calendar.status.${row.status}`)}
            </StatusChip>
            <div className="ml-auto flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(row)}
                aria-label={t("admin.calendar.edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(row)}
                aria-label={t("admin.calendar.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {row.client_name || row.client_phone ? (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-sm">
              <span className="font-medium">{row.client_name}</span>
              {row.client_phone ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {row.client_phone}
                </span>
              ) : null}
            </p>
          ) : null}

          {row.listing ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {pickLocalized(row.listing.title, locale)}
            </p>
          ) : null}

          {row.location ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {row.location}
            </p>
          ) : null}

          {row.note ? <p className="mt-1.5 text-sm text-muted-foreground">{row.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}
