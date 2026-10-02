import { createFileRoute } from "@tanstack/react-router";

import { PostsPage } from "@/components/admin/posts/PostsPage";

export const Route = createFileRoute("/admin/_authenticated/posts")({
  staticData: { sitemap: false },
  component: PostsPage,
});
