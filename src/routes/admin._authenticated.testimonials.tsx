import { createFileRoute } from "@tanstack/react-router";

import { TestimonialsPage } from "@/components/admin/testimonials/TestimonialsPage";

export const Route = createFileRoute("/admin/_authenticated/testimonials")({
  staticData: { sitemap: false },
  component: TestimonialsPage,
});
