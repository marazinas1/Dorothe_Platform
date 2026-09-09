import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import type { TestimonialRow } from "./types";

const COLUMNS = "id, quote, author_name, author_detail, sort_order, published, show_on_home";

/** Published quotes only — the public read path, RLS filters the rest. */
export const listPublicTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<TestimonialRow[]> => {
    const { createPublicSupabase } = await import("@/lib/supabase/server-public");
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("testimonials")
      .select(COLUMNS)
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Failed to load testimonials: ${error.message}`);
    return (data ?? []) as unknown as TestimonialRow[];
  },
);

export const publicTestimonialsQueryOptions = queryOptions({
  queryKey: ["public_testimonials"],
  queryFn: () => listPublicTestimonials(),
  staleTime: 60_000,
});
