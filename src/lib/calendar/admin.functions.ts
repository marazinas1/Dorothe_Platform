// Internal calendar server functions. Staff-only: RLS restricts the table to
// staff, and every endpoint re-asserts the permission server-side.
import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  AppointmentIdSchema,
  AppointmentInputSchema,
  AppointmentRangeSchema,
} from "@/lib/validation/calendar";

import type { AppointmentRow } from "./types";

const COLUMNS =
  "id, day, start_time, end_time, kind, status, listing_id, inquiry_id, client_name, client_phone, location, note, listings(id, slug, title)";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertStaff(supabase: any, userId: string) {
  const { assertPermission } = await import("@/lib/auth/require-permission.server");
  await assertPermission(supabase, userId, "inquiry.view.own");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shape(row: any): AppointmentRow {
  const { listings, ...rest } = row;
  return { ...rest, listing: listings ?? null } as AppointmentRow;
}

export const listAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AppointmentRangeSchema.parse(input))
  .handler(async ({ data, context }): Promise<AppointmentRow[]> => {
    const { supabase, userId } = context;
    await assertStaff(supabase, userId);
    const { data: rows, error } = await supabase
      .from("appointments")
      .select(COLUMNS)
      .gte("day", data.from)
      .lte("day", data.to)
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });
    if (error) throw new Error(`Failed to load calendar: ${error.message}`);
    return (rows ?? []).map(shape);
  });

export function appointmentsQueryOptions(from: string, to: string) {
  return queryOptions({
    queryKey: ["admin", "appointments", from, to],
    queryFn: () => listAppointments({ data: { from, to } }),
  });
}

export const saveAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AppointmentInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertStaff(supabase, userId);
    const patch = {
      day: data.day,
      start_time: data.start_time,
      end_time: data.end_time || null,
      kind: data.kind,
      status: data.status,
      listing_id: data.listing_id,
      inquiry_id: data.inquiry_id,
      client_name: data.client_name,
      client_phone: data.client_phone,
      location: data.location,
      note: data.note,
    };

    if (data.id) {
      const { error } = await supabase
        .from("appointments")
        .update(patch as never)
        .eq("id", data.id);
      if (error) throw new Error(`Save failed: ${error.message}`);
      return { ok: true as const };
    }

    const { error } = await supabase
      .from("appointments")
      .insert({ ...patch, created_by: userId } as never);
    if (error) throw new Error(`Save failed: ${error.message}`);
    return { ok: true as const };
  });

export const deleteAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AppointmentIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertStaff(supabase, userId);
    const { error } = await supabase.from("appointments").delete().eq("id", data.id);
    if (error) throw new Error(`Delete failed: ${error.message}`);
    return { ok: true as const };
  });
