export const ROLES = {
  JOB_SEEKER: "job_seeker",
  RECRUITER: "recruiter",
  ADMIN: "admin",
};

export const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

export const WORK_MODES = [
  { value: "onsite", label: "Onsite" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export const JOB_STATUSES = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
];

export const APPLICATION_STATUSES = [
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
];

export const SORT_OPTIONS = [
  { value: "latest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "salaryHigh", label: "Salary: High to Low" },
  { value: "salaryLow", label: "Salary: Low to High" },
];

export const THEME_STORAGE_KEY = "jobologyx-theme";
export const AUTH_TOKEN_KEY = "jobologyx-token";
