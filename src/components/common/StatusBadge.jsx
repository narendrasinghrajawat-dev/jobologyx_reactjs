import { useTranslation } from "react-i18next";
import Badge from "./Badge";

const APPLICATION_VARIANTS = {
  applied: "info",
  reviewing: "warning",
  shortlisted: "primary",
  rejected: "error",
  hired: "success",
};

const JOB_VARIANTS = {
  active: "success",
  closed: "error",
  draft: "slate",
};

const USER_VARIANTS = {
  true: "success",
  false: "error",
};

const StatusBadge = ({ status, type = "application" }) => {
  const { t } = useTranslation();
  const variants = type === "job" ? JOB_VARIANTS : type === "user" ? USER_VARIANTS : APPLICATION_VARIANTS;
  const namespace = type === "job" ? "status.job" : type === "user" ? "status.user" : "status.application";
  const variant = variants[status] || "slate";

  return <Badge variant={variant}>{t(`${namespace}.${status}`, status)}</Badge>;
};

export default StatusBadge;
