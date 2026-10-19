import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please provide a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  inquiryType: z.string().optional().or(z.literal("")),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject must be under 150 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
