import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Was this slug a listing that has since been archived? Answers only yes/no,
 * so nothing about a non-public listing leaks. Lets old links land on the
 * Properties page instead of a dead end.
 */
export const isArchivedListingSlug = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ slug: z.string().trim().min(1).max(200) }).parse(raw),
  )
  .handler(async ({ data }): Promise<boolean> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("listings")
      .select("status")
      .eq("slug", data.slug)
      .maybeSingle();
    return row?.status === "archived";
  });
