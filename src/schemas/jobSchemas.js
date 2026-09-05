import { z } from "zod";
import { JOB_TYPE_VALUES, WORK_MODE_VALUES, JOB_STATUS_VALUES } from "../utils/constants";

export const createJobSchema = (t) =>
  z
    .object({
      title: z.string().trim().min(3, t("validation.titleMin")),
      description: z.string().trim().min(20, t("validation.descriptionMin")),
      location: z.string().trim().min(1, t("validation.locationRequired")),
      jobType: z.enum(JOB_TYPE_VALUES, { message: t("validation.jobTypeRequired") }),
      workMode: z.enum(WORK_MODE_VALUES, { message: t("validation.workModeRequired") }),
      salaryMin: z.coerce.number().min(0, t("validation.salaryMinValue")).optional().or(z.literal("")),
      salaryMax: z.coerce.number().min(0, t("validation.salaryMinValue")).optional().or(z.literal("")),
      experience: z.string().trim().optional().or(z.literal("")),
      skillsInput: z.string().trim().optional().or(z.literal("")),
      category: z.string().trim().optional().or(z.literal("")),
      applicationDeadline: z.string().trim().optional().or(z.literal("")),
      status: z.enum(JOB_STATUS_VALUES),
    })
    .refine(
      (data) =>
        !data.salaryMin || !data.salaryMax || Number(data.salaryMax) === 0 || Number(data.salaryMin) <= Number(data.salaryMax),
      { message: t("validation.salaryRange"), path: ["salaryMax"] }
    );
