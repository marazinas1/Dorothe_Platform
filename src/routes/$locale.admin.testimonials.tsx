import { createFileRoute } from "@tanstack/react-router";

import { TestimonialsPage } from "@/components/admin/testimonials/TestimonialsPage";

export const Route = createFileRoute("/$locale/admin/testimonials")({
  staticData: { sitemap: false },
  component: TestimonialsPage,
});
