import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(5000),
  is_published: z.boolean().default(true),
  show_on_home: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export type FaqInput = z.infer<typeof faqSchema>;
