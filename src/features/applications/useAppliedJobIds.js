import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyApplications } from "../../services/applicationApi";
import { ROLES } from "../../utils/constants";

// Shared across any grid of JobCards (Jobs listing, Home's Featured Jobs) so
// "already applied" is checked once per page load instead of once per card.
export const useAppliedJobIds = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isSeeker = isAuthenticated && user?.role === ROLES.JOB_SEEKER;
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    if (!isSeeker) {
      setAppliedJobIds(new Set());
      return;
    }
    getMyApplications({ limit: 100 }).then((res) => {
      setAppliedJobIds(new Set(res.data.applications.map((app) => app.job?._id).filter(Boolean)));
    });
  }, [isSeeker]);

  const markApplied = useCallback((jobId) => {
    setAppliedJobIds((prev) => new Set(prev).add(jobId));
  }, []);

  return { appliedJobIds, markApplied };
};
