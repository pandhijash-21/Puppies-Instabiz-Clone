import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(6, "Phone is required").max(40),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  area: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  puppy_id: z.string().uuid().optional().nullable().or(z.literal("")),
  source: z.enum(["contact_form", "puppy_form", "whatsapp_click"]).default("contact_form"),
  website: z.string().optional(), // honeypot
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
