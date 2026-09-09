import type { HomeCopy } from "@/lib/home/content";

import type { TestiItem } from "./types";

/**
 * Placeholder voices used only while the testimonials table is still empty, so
 * a fresh clone never renders an empty proof section. The text comes from the
 * shared message catalogue, never from client data.
 */
export function fallbackTestiItems(copy: HomeCopy): TestiItem[] {
  return [1, 2, 3]
    .map((n) => ({
      quote: copy.text(`testi${n}_quote`),
      name: copy.text(`testi${n}_name`),
      town: copy.text(`testi${n}_town`),
    }))
    .filter((item) => item.quote);
}
