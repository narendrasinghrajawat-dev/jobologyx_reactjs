import { z } from "zod";

export const createLoginSchema = (t) =>
  z.object({
    email: z.string().trim().min(1, t("validation.emailRequired")).email(t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });

export const createRegisterSchema = (t) =>
  z
    .object({
      name: z.string().trim().min(2, t("validation.nameMin")),
      email: z.string().trim().min(1, t("validation.emailRequired")).email(t("validation.emailInvalid")),
      password: z.string().min(6, t("validation.passwordMin")),
      confirmPassword: z.string().min(1, t("validation.confirmRequired")),
      role: z.enum(["job_seeker", "recruiter"], { message: t("validation.roleRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });
