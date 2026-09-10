import { createFileRoute } from "@tanstack/react-router";

import { CalendarPage } from "@/components/admin/calendar/CalendarPage";

export const Route = createFileRoute("/$locale/admin/calendar")({
  staticData: { sitemap: false },
  component: CalendarPage,
});
