import { z } from "zod";

export const createSeekerProfileSchema = (t) =>
  z.object({
    name: z.string().trim().min(2, t("validation.nameMin")),
    phone: z.string().trim().optional().or(z.literal("")),
    bio: z.string().trim().max(1000, t("validation.bioMax")).optional().or(z.literal("")),
    location: z.string().trim().optional().or(z.literal("")),
    skillsInput: z.string().trim().optional().or(z.literal("")),
  });

export const createRecruiterProfileSchema = (t) =>
  z.object({
    name: z.string().trim().min(2, t("validation.nameMin")),
    phone: z.string().trim().optional().or(z.literal("")),
    bio: z.string().trim().max(1000, t("validation.bioMax")).optional().or(z.literal("")),
    location: z.string().trim().optional().or(z.literal("")),
    companyName: z.string().trim().min(1, t("validation.companyNameRequired")),
    companyWebsite: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine((val) => !val || /^https?:\/\/.+/.test(val), t("validation.urlInvalid")),
  });
