import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { appointmentsQueryOptions } from "@/lib/calendar/admin.functions";
import { shortTime, type AppointmentRow } from "@/lib/calendar/types";
import { agendaWindow, agendaDayLabel } from "@/lib/dashboard/agenda";
import { QUEUE_LIMIT } from "@/lib/dashboard/types";
import { QueueGroup } from "./QueueGroup";

/**
 * The days ahead: viewings, meetings and personal blocks in the coming week.
 * First group of the work queue, because it is the one thing that is tied to a
 * clock — everything else can wait until later in the day.
 */
export function AgendaQueue({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const { from, to } = agendaWindow();
  const query = useQuery(appointmentsQueryOptions(from, to));

  const items = (query.data ?? []).filter((row) => row.status !== "cancelled");
  const shown = items.slice(0, QUEUE_LIMIT);

  return (
    <QueueGroup
      titleKey="admin.dashboard.queue.agenda.title"
      emptyKey="admin.dashboard.queue.agenda.empty"
      count={items.length}
      shown={shown.length}
      loading={query.isPending}
      failed={query.isError}
      footer={
        <Link
          to="/$locale/admin/calendar"
          params={{ locale }}
          className="underline-offset-4 hover:underline"
        >
          {t("admin.dashboard.queue.agenda.all")}
        </Link>
      }
    >
      <ul className="grid gap-2">
        {shown.map((row) => (
          <li key={row.id}>
            <Row row={row} locale={locale} />
          </li>
        ))}
      </ul>
    </QueueGroup>
  );
}

function Row({ row, locale }: { row: AppointmentRow; locale: string }) {
  const { t } = useTranslation();
  const time = shortTime(row.start_time);

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 rounded-md px-1.5 py-1.5 hover:bg-muted">
      <span className="text-sm font-medium tabular-nums">
        {agendaDayLabel(row.day, locale)} {time}
      </span>
      <span className="text-sm text-muted-foreground">
        {row.client_name || t(`admin.calendar.kinds.${row.kind}`)}
      </span>
      {row.location ? (
        <span className="ml-auto truncate text-xs text-muted-foreground">{row.location}</span>
      ) : null}
    </div>
  );
}
