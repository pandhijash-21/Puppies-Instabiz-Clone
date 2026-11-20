import { z } from "zod";

export const puppySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  breed: z.string().trim().min(1).max(120),
  gender: z.enum(["boy", "girl", "boy_and_girl"]),
  age_label: z.string().trim().min(1).max(80),
  description: z.string().trim().max(5000).default(""),
  location_type: z.enum(["dubai_showroom", "imported"]),
  availability: z.enum(["available", "gone_home"]),
  status: z.enum(["draft", "published", "archived"]),
  has_video: z.boolean().default(false),
  is_korean_teacup: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export type PuppyInput = z.infer<typeof puppySchema>;
