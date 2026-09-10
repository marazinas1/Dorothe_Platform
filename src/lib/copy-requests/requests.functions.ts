import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  DefaultTextRequestCreateSchema,
  DefaultTextRequestResolveSchema,
  DefaultTextRequestSeenSchema,
} from "@/lib/validation/copy-requests";

import { DEFAULT_TEXT_REQUEST_COLUMNS, type DefaultTextRequest } from "./types";

/** Every request the caller may see: their own, or all of them for a developer. */
export const listDefaultTextRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DefaultTextRequest[]> => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("default_text_requests")
      .select(DEFAULT_TEXT_REQUEST_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(`Failed to load requests: ${error.message}`);
    return (data ?? []) as unknown as DefaultTextRequest[];
  });

export const defaultTextRequestsQueryOptions = queryOptions({
  queryKey: ["default_text_requests"],
  queryFn: () => listDefaultTextRequests(),
});

/** The broker asks for their wording to become the default. Nothing changes yet. */
export const createDefaultTextRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => DefaultTextRequestCreateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { assertPermission } = await import("@/lib/auth/require-permission.server");
    await assertPermission(supabase, userId, "settings.edit");

    const { error } = await supabase.from("default_text_requests").insert({
      scope: data.scope,
      page: data.scope === "page" ? (data.page ?? null) : null,
      field_key: data.field_key,
      locale: data.locale,
      requested_text: data.requested_text,
      requested_by: userId,
    } as never);
    if (error) throw new Error(`Request failed: ${error.message}`);

    const { data: me } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .maybeSingle();

    const { notifyDeveloperOfDefaultRequest } = await import("./notify.server");
    await notifyDeveloperOfDefaultRequest(supabase, {
      scope: data.scope,
      page: data.scope === "page" ? (data.page ?? null) : null,
      field_key: data.field_key,
      locale: data.locale,
      requested_text: data.requested_text,
      requesterEmail: (me as { email?: string } | null)?.email ?? null,
    });

    return { ok: true as const };
  });

/** Developer-only: approve (lock the wording in) or decline the request. */
export const resolveDefaultTextRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => DefaultTextRequestResolveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if ((profile as { role?: string } | null)?.role !== "developer") {
      throw new Response("Forbidden", { status: 403 });
    }

    const { data: request, error } = await supabase
      .from("default_text_requests")
      .select(DEFAULT_TEXT_REQUEST_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error || !request) throw new Error("Request not found");
    const row = request as unknown as DefaultTextRequest;
    if (row.status !== "pending") return { ok: true as const };

    if (data.approve) {
      const { applyDefaultTextRequest } = await import("./apply.server");
      await applyDefaultTextRequest(supabase, row);
    }

    const { error: writeError } = await supabase
      .from("default_text_requests")
      .update({
        status: data.approve ? "approved" : "declined",
        resolved_by: userId,
        resolved_at: new Date().toISOString(),
        seen_by_requester: false,
      } as never)
      .eq("id", data.id);
    if (writeError) throw new Error(`Update failed: ${writeError.message}`);

    return { ok: true as const };
  });

/** The requester dismisses the approved/declined notices they just read. */
export const markDefaultTextRequestsSeen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => DefaultTextRequestSeenSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("default_text_requests")
      .update({ seen_by_requester: true } as never)
      .in("id", data.ids)
      .eq("requested_by", userId);
    if (error) throw new Error(`Update failed: ${error.message}`);
    return { ok: true as const };
  });
