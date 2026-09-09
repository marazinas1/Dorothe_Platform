import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import { PageContentSelectSchema } from "@/lib/validation/pages";

import { PAGE_CONTENT_COLUMNS, type PageContentRow } from "./types";

/** One page's stored copy — the public read path. */
export const getPageContent = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => PageContentSelectSchema.parse(input))
  .handler(async ({ data }): Promise<PageContentRow | null> => {
    const { createPublicSupabase } = await import("@/lib/supabase/server-public");
    const supabase = createPublicSupabase();
    const { data: row, error } = await supabase
      .from("page_content")
      .select(PAGE_CONTENT_COLUMNS)
      .eq("page", data.page)
      .maybeSingle();
    if (error) throw new Error(`Failed to load page content: ${error.message}`);
    return (row ?? null) as unknown as PageContentRow | null;
  });

export const pageContentQueryOptions = (page: string) =>
  queryOptions({
    queryKey: ["page_content", page],
    queryFn: () => getPageContent({ data: { page } }),
    staleTime: 60_000,
  });
