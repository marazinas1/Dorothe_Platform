import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/probe-static")({
  staticData: { sitemap: false },
  server: { handlers: { GET: async () => new Response("probe") } },
});
