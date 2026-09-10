import { z } from "zod";

import { APPOINTMENT_KINDS, APPOINTMENT_STATUSES } from "@/lib/calendar/types";

const time = z
  .string()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/)
  .transform((v) => (v.length === 5 ? `${v}:00` : v));

export const AppointmentInputSchema = z.object({
  id: z.string().uuid().optional(),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: time,
  end_time: time.optional().nullable(),
  kind: z.enum(APPOINTMENT_KINDS).default("viewing"),
  status: z.enum(APPOINTMENT_STATUSES).default("planned"),
  listing_id: z.string().uuid().nullable().default(null),
  inquiry_id: z.string().uuid().nullable().default(null),
  client_name: z.string().trim().max(120).default(""),
  client_phone: z.string().trim().max(60).default(""),
  location: z.string().trim().max(200).default(""),
  note: z.string().trim().max(2000).default(""),
});

export type AppointmentInput = z.infer<typeof AppointmentInputSchema>;

export const AppointmentIdSchema = z.object({ id: z.string().uuid() });

export const AppointmentRangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
