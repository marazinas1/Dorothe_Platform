import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertCanEditListing } from "./admin.server";

const ListingOrderInput = z.object({
  order: z.array(z.string().uuid()).min(1),
});

/** Persist the broker-facing collection order used by the public catalogue. */
export const reorderAdminListings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ListingOrderInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const uniqueOrder = Array.from(new Set(data.order));
    if (uniqueOrder.length !== data.order.length) throw new Error("Duplicate listing in order.");

    for (const id of uniqueOrder) await assertCanEditListing(supabase, userId, id);

    for (let index = 0; index < uniqueOrder.length; index += 1) {
      const { error } = await supabase
        .from("listings")
        .update({ sort_order: (index + 1) * 10 } as never)
        .eq("id", uniqueOrder[index]);
      if (error) throw new Error(`Reorder failed: ${error.message}`);
    }
    return { ok: true as const };
  });