import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import { PostSlugSchema } from "@/lib/validation/posts";

import { POST_COLUMNS, type PostRow } from "./types";

/** Published articles, newest first. RLS hides drafts and future dates. */
export const listPublicPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PostRow[]> => {
    const { createPublicSupabase } = await import("@/lib/supabase/server-public");
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select(POST_COLUMNS)
      .order("published_at", { ascending: false })
      .limit(60);
    if (error) throw new Error(`Failed to load posts: ${error.message}`);
    return (data ?? []) as unknown as PostRow[];
  },
);

export const publicPostsQueryOptions = queryOptions({
  queryKey: ["public_posts"],
  queryFn: () => listPublicPosts(),
  staleTime: 60_000,
});

/**
 * One article by address. An old address still resolves — the current slug is
 * returned so the page can point the canonical at it.
 */
export const getPublicPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => PostSlugSchema.parse(input))
  .handler(async ({ data }): Promise<PostRow | null> => {
    const { createPublicSupabase } = await import("@/lib/supabase/server-public");
    const supabase = createPublicSupabase();

    const direct = await supabase
      .from("posts")
      .select(POST_COLUMNS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (direct.error) throw new Error(`Failed to load post: ${direct.error.message}`);
    if (direct.data) return direct.data as unknown as PostRow;

    const history = await supabase
      .from("post_slug_history")
      .select("post_id")
      .eq("slug", data.slug)
      .maybeSingle();
    const postId = (history.data as { post_id?: string } | null)?.post_id;
    if (!postId) return null;

    const previous = await supabase
      .from("posts")
      .select(POST_COLUMNS)
      .eq("id", postId)
      .maybeSingle();
    return (previous.data ?? null) as unknown as PostRow | null;
  });

export const publicPostQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["public_post", slug],
    queryFn: () => getPublicPost({ data: { slug } }),
    staleTime: 60_000,
  });
