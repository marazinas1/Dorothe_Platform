/** Internal calendar (core). Viewings, meetings and personal blocks. */

export const APPOINTMENT_KINDS = ["viewing", "meeting", "personal"] as const;
export type AppointmentKind = (typeof APPOINTMENT_KINDS)[number];

export const APPOINTMENT_STATUSES = [
  "planned",
  "confirmed",
  "done",
  "cancelled",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface AppointmentRow {
  id: string;
  day: string;
  start_time: string;
  end_time: string | null;
  kind: AppointmentKind;
  status: AppointmentStatus;
  listing_id: string | null;
  inquiry_id: string | null;
  client_name: string;
  client_phone: string;
  location: string;
  note: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: { id: string; slug: string; title: any } | null;
}

/** "09:30:00" -> "09:30" so the UI never shows seconds. */
export function shortTime(value: string | null): string {
  if (!value) return "";
  return value.slice(0, 5);
}
