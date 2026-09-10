import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  PageContentSaveSchema,
  PageContentSelectSchema,
  PageDefaultsSaveSchema,
} from "@/lib/validation/pages";

import { PAGE_CONTENT_COLUMNS, type PageContentRow } from "./types";

async function assertEditor(supabase: any, userId: string) {
  const { assertPermission } = await import("@/lib/auth/require-permission.server");
  await assertPermission(supabase, userId, "settings.edit");
}

/** Locking wording in as the default is a developer act, never the owner's. */
async function assertDeveloper(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (error || data?.role !== "developer") {
    throw new Response("Forbidden", { status: 403 });
  }
}


/** The stored copy of one page, for the admin editor. */
export const getAdminPageContent = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PageContentSelectSchema.parse(input))
  .handler(async ({ data, context }): Promise<PageContentRow | null> => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const { data: row, error } = await supabase
      .from("page_content")
      .select(PAGE_CONTENT_COLUMNS)
      .eq("page", data.page)
      .maybeSingle();
    if (error) throw new Error(`Failed to load page content: ${error.message}`);
    return (row ?? null) as unknown as PageContentRow | null;
  });

export const adminPageContentQueryOptions = (page: string) =>
  queryOptions({
    queryKey: ["admin_page_content", page],
    queryFn: () => getAdminPageContent({ data: { page } }),
  });

export const savePageContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PageContentSaveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const { error } = await supabase
      .from("page_content")
      .upsert(
        { page: data.page, content: data.content, media: data.media } as never,
        { onConflict: "page" },
      );
    if (error) throw new Error(`Save failed: ${error.message}`);
    return { ok: true as const };
  });

/**
 * Developer-only: freeze the current wording as this clone's default. The
 * override is cleared in the same write, so the field falls back to the new
 * default and shows it greyed out.
 */
export const savePageDefaults = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PageDefaultsSaveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    await assertDeveloper(supabase, userId);
    const { error } = await supabase
      .from("page_content")
      .upsert(
        { page: data.page, defaults: data.defaults, content: data.content } as never,
        { onConflict: "page" },
      );
    if (error) throw new Error(`Save failed: ${error.message}`);
    return { ok: true as const };
  });

