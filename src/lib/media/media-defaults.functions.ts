import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { MEDIA_SLOTS, type MediaSlotKey } from "./slots";

const keys = Object.keys(MEDIA_SLOTS) as [MediaSlotKey, ...MediaSlotKey[]];

const Input = z.object({
  key: z.enum(keys),
  url: z.string().url().max(2000).nullable(),
});

/** Developer-only: pin or clear the studio default for one photograph. */
export const setMediaDefault = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.role !== "developer") throw new Response("Forbidden", { status: 403 });

    const { data: row, error: readError } = await supabase
      .from("site_settings")
      .select("id, media_defaults")
      .limit(1)
      .maybeSingle();
    if (readError || !row) throw new Error("site_settings row missing");

    const next = { ...((row as { media_defaults?: Record<string, unknown> }).media_defaults ?? {}) };
    if (data.url) next[data.key] = data.url;
    else delete next[data.key];

    const { error } = await supabase
      .from("site_settings")
      .update({ media_defaults: next } as never)
      .eq("id", row.id);
    if (error) throw new Error(`Save failed: ${error.message}`);
    return { ok: true as const };
  });
