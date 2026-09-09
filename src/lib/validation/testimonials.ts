import { z } from "zod";

const localizedText = z.record(z.string(), z.string().max(1200)).default({});

export const TestimonialInputSchema = z.object({
  id: z.string().uuid().optional(),
  quote: localizedText,
  author_name: z.string().trim().max(120).default(""),
  author_detail: z.string().trim().max(160).default(""),
  published: z.boolean().default(false),
  show_on_home: z.boolean().default(false),
});

export type TestimonialInput = z.infer<typeof TestimonialInputSchema>;

export const TestimonialIdSchema = z.object({ id: z.string().uuid() });

export const TestimonialMoveSchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(["up", "down"]),
});
