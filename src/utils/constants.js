export const ROLES = {
  JOB_SEEKER: "job_seeker",
  RECRUITER: "recruiter",
  ADMIN: "admin",
};

// Raw value lists — labels are resolved via translation, see hooks/useOptions.js
export const JOB_TYPE_VALUES = ["full_time", "part_time", "contract", "internship", "freelance"];
export const WORK_MODE_VALUES = ["onsite", "remote", "hybrid"];
export const JOB_STATUS_VALUES = ["active", "closed", "draft"];
export const APPLICATION_STATUS_VALUES = ["applied", "reviewing", "shortlisted", "rejected", "hired"];
export const SORT_VALUES = ["latest", "oldest", "salaryHigh", "salaryLow"];
export const ROLE_VALUES = [ROLES.JOB_SEEKER, ROLES.RECRUITER, ROLES.ADMIN];

export const THEME_STORAGE_KEY = "jobologyx-theme";
export const AUTH_TOKEN_KEY = "jobologyx-token";
export const LANGUAGE_STORAGE_KEY = "jobologyx-language";
