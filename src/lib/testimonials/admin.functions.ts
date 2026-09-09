import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  TestimonialIdSchema,
  TestimonialInputSchema,
  TestimonialMoveSchema,
} from "@/lib/validation/testimonials";

import type { TestimonialRow } from "./types";

const COLUMNS = "id, quote, author_name, author_detail, sort_order, published, show_on_home";

async function assertEditor(supabase: any, userId: string) {
  const { assertPermission } = await import("@/lib/auth/require-permission.server");
  await assertPermission(supabase, userId, "settings.edit");
}

/** Every testimonial, published or not — the admin list. */
export const listTestimonials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TestimonialRow[]> => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const { data, error } = await supabase
      .from("testimonials")
      .select(COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Failed to load testimonials: ${error.message}`);
    return (data ?? []) as unknown as TestimonialRow[];
  });

export const adminTestimonialsQueryOptions = queryOptions({
  queryKey: ["admin_testimonials"],
  queryFn: () => listTestimonials(),
});

export const saveTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TestimonialInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const patch = {
      quote: data.quote,
      author_name: data.author_name,
      author_detail: data.author_detail,
      published: data.published,
      show_on_home: data.show_on_home,
    };

    if (data.id) {
      const { error } = await supabase
        .from("testimonials")
        .update(patch as never)
        .eq("id", data.id);
      if (error) throw new Error(`Save failed: ${error.message}`);
      return { ok: true as const };
    }

    const { data: last } = await supabase
      .from("testimonials")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = ((last as { sort_order?: number } | null)?.sort_order ?? 0) + 10;
    const { error } = await supabase
      .from("testimonials")
      .insert({ ...patch, sort_order: nextOrder } as never);
    if (error) throw new Error(`Save failed: ${error.message}`);
    return { ok: true as const };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TestimonialIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const { error } = await supabase.from("testimonials").delete().eq("id", data.id);
    if (error) throw new Error(`Delete failed: ${error.message}`);
    return { ok: true as const };
  });

/** Swaps the row with its neighbour, so the owner never sees numbers. */
export const moveTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TestimonialMoveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const { data: rows, error } = await supabase
      .from("testimonials")
      .select("id, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Reorder failed: ${error.message}`);
    const list = (rows ?? []) as unknown as Array<{ id: string; sort_order: number }>;
    const index = list.findIndex((r) => r.id === data.id);
    const target = data.direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= list.length) return { ok: true as const };

    // Rewrite the whole order so ties from equal values cannot survive.
    const reordered = [...list];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    for (let i = 0; i < reordered.length; i += 1) {
      const { error: upErr } = await supabase
        .from("testimonials")
        .update({ sort_order: (i + 1) * 10 } as never)
        .eq("id", reordered[i].id);
      if (upErr) throw new Error(`Reorder failed: ${upErr.message}`);
    }
    return { ok: true as const };
  });
