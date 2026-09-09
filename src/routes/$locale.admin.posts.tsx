import { createFileRoute } from "@tanstack/react-router";

import { PostsPage } from "@/components/admin/posts/PostsPage";

export const Route = createFileRoute("/$locale/admin/posts")({
  staticData: { sitemap: false },
  component: PostsPage,
});
