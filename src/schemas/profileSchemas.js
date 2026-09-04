import { z } from "zod";

export const seekerProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().max(1000, "Bio must be under 1000 characters").optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  skillsInput: z.string().trim().optional().or(z.literal("")),
});

export const recruiterProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().max(1000, "Bio must be under 1000 characters").optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  companyName: z.string().trim().min(1, "Company name is required"),
  companyWebsite: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^https?:\/\/.+/.test(val), "Enter a valid URL starting with http:// or https://"),
});
