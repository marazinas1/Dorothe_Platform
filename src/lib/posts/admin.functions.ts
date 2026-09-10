import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PostIdSchema, PostInputSchema } from "@/lib/validation/posts";

import { POST_COLUMNS, type PostRow } from "./types";

async function assertEditor(supabase: any, userId: string) {
  const { assertPermission } = await import("@/lib/auth/require-permission.server");
  await assertPermission(supabase, userId, "settings.edit");
}

/** Every article, drafts included — the admin list. */
export const listPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PostRow[]> => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const { data, error } = await supabase
      .from("posts")
      .select(POST_COLUMNS)
      .order("published_at", { ascending: false, nullsFirst: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Failed to load posts: ${error.message}`);
    return (data ?? []) as unknown as PostRow[];
  });

export const adminPostsQueryOptions = queryOptions({
  queryKey: ["admin_posts"],
  queryFn: () => listPosts(),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PostInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);

    // Publishing without a date would hide the article from the public policy.
    const publishedAt =
      data.status === "published" ? (data.published_at || new Date().toISOString()) : data.published_at;

    const patch = {
      slug: data.slug || null,
      status: data.status,
      published_at: publishedAt,
      cover_path: data.cover_path,
      cover_alt: data.cover_alt,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };

    if (data.id) {
      const { error } = await supabase
        .from("posts")
        .update(patch as never)
        .eq("id", data.id);
      if (error) throw new Error(`Save failed: ${error.message}`);
      return { ok: true as const, id: data.id };
    }

    // The id comes back so a fresh article can immediately own its cover image.
    const { data: created, error } = await supabase
      .from("posts")
      .insert({ ...patch, created_by: userId } as never)
      .select("id")
      .single();
    if (error) throw new Error(`Save failed: ${error.message}`);
    return { ok: true as const, id: (created as { id: string }).id };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PostIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertEditor(supabase, userId);
    const { error } = await supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(`Delete failed: ${error.message}`);
    return { ok: true as const };
  });
