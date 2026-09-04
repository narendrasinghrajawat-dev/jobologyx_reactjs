import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Briefcase, MapPin, Wallet } from "lucide-react";
import { ROLES, JOB_TYPES, WORK_MODES } from "../../utils/constants";
import { formatRelativeDate } from "../../utils/formatDate";
import Badge from "../common/Badge";
import Button from "../common/Button";
import ApplyModal from "../applications/ApplyModal";

const jobTypeLabel = (value) => JOB_TYPES.find((t) => t.value === value)?.label || value;
const workModeLabel = (value) => WORK_MODES.find((m) => m.value === value)?.label || value;

const formatSalary = (min, max) => {
  if (!min && !max) return null;
  const fmt = (n) => (n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n.toLocaleString());
  if (min && max) return `₹${fmt(min)} - ₹${fmt(max)}`;
  return `₹${fmt(min || max)}`;
};

const JobCard = ({ job }) => {
  const [applyOpen, setApplyOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const canApply = isAuthenticated && user?.role === ROLES.JOB_SEEKER;
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.companyName}
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {job.companyName?.[0]?.toUpperCase() || <Briefcase className="h-5 w-5" />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Link
            to={`/jobs/${job._id}`}
            className="block truncate text-base font-semibold text-slate-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
          >
            {job.title}
          </Link>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">{job.companyName}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        {salary && (
          <span className="flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" />
            {salary}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="primary">{jobTypeLabel(job.jobType)}</Badge>
        <Badge variant="slate">{workModeLabel(job.workMode)}</Badge>
        {job.experience && <Badge variant="slate">{job.experience}</Badge>}
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs text-slate-400">+{job.skills.length - 4} more</span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-400">Posted {formatRelativeDate(job.createdAt)}</span>
        <div className="flex items-center gap-2">
          <Link to={`/jobs/${job._id}`}>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </Link>
          {canApply && (
            <Button size="sm" onClick={() => setApplyOpen(true)}>
              Apply
            </Button>
          )}
        </div>
      </div>

      {canApply && <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} job={job} />}
    </div>
  );
};

export default JobCard;
