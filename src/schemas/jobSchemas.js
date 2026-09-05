import { z } from "zod";

// jobType/workMode/status option values now come from the backend's
// master-data endpoint rather than a hardcoded list, so these are validated
// as non-empty strings instead of a static enum — the backend remains the
// authority on which values are actually valid.
export const createJobSchema = (t) =>
  z
    .object({
      title: z.string().trim().min(3, t("validation.titleMin")),
      description: z.string().trim().min(20, t("validation.descriptionMin")),
      location: z.string().trim().min(1, t("validation.locationRequired")),
      jobType: z.string().trim().min(1, t("validation.jobTypeRequired")),
      workMode: z.string().trim().min(1, t("validation.workModeRequired")),
      salaryMin: z.coerce.number().min(0, t("validation.salaryMinValue")).optional().or(z.literal("")),
      salaryMax: z.coerce.number().min(0, t("validation.salaryMinValue")).optional().or(z.literal("")),
      experience: z.string().trim().optional().or(z.literal("")),
      skillsInput: z.string().trim().optional().or(z.literal("")),
      category: z.string().trim().optional().or(z.literal("")),
      applicationDeadline: z.string().trim().optional().or(z.literal("")),
      status: z.string().trim().min(1),
    })
    .refine(
      (data) =>
        !data.salaryMin || !data.salaryMax || Number(data.salaryMax) === 0 || Number(data.salaryMin) <= Number(data.salaryMax),
      { message: t("validation.salaryRange"), path: ["salaryMax"] }
    );
