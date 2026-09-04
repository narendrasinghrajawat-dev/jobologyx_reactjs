import { z } from "zod";

const jobTypeValues = ["full_time", "part_time", "contract", "internship", "freelance"];
const workModeValues = ["onsite", "remote", "hybrid"];
const statusValues = ["active", "closed", "draft"];

export const jobSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    description: z.string().trim().min(20, "Description must be at least 20 characters"),
    location: z.string().trim().min(1, "Location is required"),
    jobType: z.enum(jobTypeValues, { message: "Select a job type" }),
    workMode: z.enum(workModeValues, { message: "Select a work mode" }),
    salaryMin: z.coerce.number().min(0, "Must be 0 or more").optional().or(z.literal("")),
    salaryMax: z.coerce.number().min(0, "Must be 0 or more").optional().or(z.literal("")),
    experience: z.string().trim().optional().or(z.literal("")),
    skillsInput: z.string().trim().optional().or(z.literal("")),
    category: z.string().trim().optional().or(z.literal("")),
    applicationDeadline: z.string().trim().optional().or(z.literal("")),
    status: z.enum(statusValues),
  })
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || Number(data.salaryMax) === 0 || Number(data.salaryMin) <= Number(data.salaryMax),
    { message: "Minimum salary cannot exceed maximum salary", path: ["salaryMax"] }
  );
