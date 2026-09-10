import { useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  appointmentsQueryOptions,
  deleteAppointment,
  saveAppointment,
} from "@/lib/calendar/admin.functions";
import { adminListingsQueryOptions } from "@/lib/listings/admin.functions";
import { dayLabel, monthLabel, monthRange, shiftMonth, todayIso } from "@/lib/calendar/month";
import type { AppointmentRow } from "@/lib/calendar/types";

import { MonthGrid } from "./MonthGrid";
import { DayList } from "./DayList";
import { AppointmentForm, toAppointmentDraft, type AppointmentDraft } from "./AppointmentForm";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSection } from "@/components/admin/ui/AdminSection";

/** Viewings, meetings and personal time in one internal calendar. */
export function CalendarPage() {
  const { t, i18n } = useTranslation();
  const { locale } = useParams({ strict: false }) as { locale: string };
  const qc = useQueryClient();

  const [selected, setSelected] = useState(todayIso());
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [editing, setEditing] = useState<AppointmentDraft | null>(null);

  const range = useMemo(() => monthRange(cursor.year, cursor.month), [cursor]);
  const { data: rows = [] } = useQuery(appointmentsQueryOptions(range.from, range.to));
  const { data: listings = [] } = useQuery(adminListingsQueryOptions);

  const dayRows = rows.filter((row) => row.day === selected);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
  }

  async function save(draft: AppointmentDraft) {
    await saveAppointment({
      data: {
        ...draft,
        end_time: draft.end_time || null,
        listing_id: draft.listing_id || null,
        inquiry_id: null,
      },
    });
    setSelected(draft.day);
    await refresh();
    setEditing(null);
  }

  async function remove(row: AppointmentRow) {
    if (!window.confirm(t("admin.calendar.confirmDelete"))) return;
    await deleteAppointment({ data: { id: row.id } });
    await refresh();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader icon={CalendarDays} title={t("admin.calendar.title")} description={t("admin.calendar.hint")} actions={<Button type="button" onClick={() => setEditing(toAppointmentDraft(selected))}>
          <Plus className="h-4 w-4" />
          {t("admin.calendar.add")}
        </Button>} />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("admin.calendar.prev")}
          onClick={() => setCursor((c) => shiftMonth(c.year, c.month, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-40 text-center text-sm font-medium">
          {monthLabel(cursor.year, cursor.month, i18n.language)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("admin.calendar.next")}
          onClick={() => setCursor((c) => shiftMonth(c.year, c.month, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const now = new Date();
            setCursor({ year: now.getFullYear(), month: now.getMonth() });
            setSelected(todayIso());
          }}
        >
          <CalendarDays className="h-4 w-4" />
          {t("admin.calendar.today")}
        </Button>
      </div>

      <MonthGrid
        year={cursor.year}
        month={cursor.month}
        selected={selected}
        rows={rows}
        onSelect={setSelected}
      />

      <AdminSection title={dayLabel(selected, i18n.language)}>
        {editing ? (
          <AppointmentForm
            initial={editing}
            listings={listings}
            locale={locale}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        ) : null}
        <DayList
          rows={dayRows}
          locale={locale}
          onEdit={(row) => setEditing(toAppointmentDraft(selected, row))}
          onDelete={remove}
        />
      </AdminSection>
    </div>
  );
}
