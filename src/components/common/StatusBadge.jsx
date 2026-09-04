import Badge from "./Badge";

const APPLICATION_MAP = {
  applied: { variant: "info", label: "Applied" },
  reviewing: { variant: "warning", label: "Reviewing" },
  shortlisted: { variant: "primary", label: "Shortlisted" },
  rejected: { variant: "error", label: "Rejected" },
  hired: { variant: "success", label: "Hired" },
};

const JOB_MAP = {
  active: { variant: "success", label: "Active" },
  closed: { variant: "error", label: "Closed" },
  draft: { variant: "slate", label: "Draft" },
};

const USER_MAP = {
  true: { variant: "success", label: "Active" },
  false: { variant: "error", label: "Inactive" },
};

const StatusBadge = ({ status, type = "application" }) => {
  const map = type === "job" ? JOB_MAP : type === "user" ? USER_MAP : APPLICATION_MAP;
  const entry = map[status] || { variant: "slate", label: status };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
};

export default StatusBadge;
