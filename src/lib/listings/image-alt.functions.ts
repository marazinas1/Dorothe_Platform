// Saves one photo's localised description (alt text). Required per photo
// before a listing can go Live; see publish-checklist.ts.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertEditListing } from "./media.functions";

const schema = z.object({
  imageId: z.string().uuid(),
  locale: z.string().min(2).max(8),
  text: z.string().trim().max(200),
});

export const saveListingImageAlt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("listing_images")
      .select("id, listing_id, alt_text")
      .eq("id", data.imageId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Not found");
    await assertEditListing(supabase, userId, row.listing_id);

    const next = { ...((row.alt_text ?? {}) as Record<string, string>) };
    if (data.text) next[data.locale] = data.text;
    else delete next[data.locale];

    const { error: updateError } = await supabase
      .from("listing_images")
      .update({ alt_text: next })
      .eq("id", row.id);
    if (updateError) throw new Error(updateError.message);
    return { ok: true as const };
  });
