import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, Calendar, MapPin, Wallet, Building2, Clock } from "lucide-react";
import { fetchJobById, clearCurrentJob } from "../../store/slices/jobSlice";
import { getMyApplications } from "../../services/applicationApi";
import { ROLES, JOB_TYPES, WORK_MODES } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";
import PageLoader from "../../components/common/PageLoader";
import ErrorState from "../../components/common/ErrorState";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ApplyModal from "../../components/applications/ApplyModal";

const jobTypeLabel = (value) => JOB_TYPES.find((t) => t.value === value)?.label || value;
const workModeLabel = (value) => WORK_MODES.find((m) => m.value === value)?.label || value;

const formatSalary = (min, max) => {
  if (!min && !max) return "Not disclosed";
  const fmt = (n) => (n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n.toLocaleString());
  if (min && max) return `₹${fmt(min)} - ₹${fmt(max)} / year`;
  return `₹${fmt(min || max)} / year`;
};

const JobDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob: job, loading, error } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [applyOpen, setApplyOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);

  const isSeeker = isAuthenticated && user?.role === ROLES.JOB_SEEKER;

  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => dispatch(clearCurrentJob());
  }, [id, dispatch]);

  useEffect(() => {
    if (!isSeeker) return;
    setCheckingApplied(true);
    getMyApplications({ limit: 100 })
      .then((res) => {
        const applied = res.data.applications.some((app) => app.job?._id === id);
        setHasApplied(applied);
      })
      .finally(() => setCheckingApplied(false));
  }, [isSeeker, id]);

  if (loading) return <PageLoader />;
  if (error || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState title="Job not found" description="This job may have been removed." />
      </div>
    );
  }

  const isClosed = job.status !== "active";
  const deadlinePassed = job.applicationDeadline && new Date(job.applicationDeadline) < new Date();

  const renderAction = () => {
    if (!isAuthenticated) {
      return (
        <Button className="w-full" onClick={() => navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } })}>
          Login to Apply
        </Button>
      );
    }
    if (!isSeeker) return null;
    if (isClosed || deadlinePassed) {
      return (
        <Button className="w-full" disabled>
          Applications Closed
        </Button>
      );
    }
    if (hasApplied) {
      return (
        <Button className="w-full" variant="secondary" disabled>
          Already Applied
        </Button>
      );
    }
    return (
      <Button className="w-full" loading={checkingApplied} onClick={() => setApplyOpen(true)}>
        Apply Now
      </Button>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {job.companyName?.[0]?.toUpperCase() || <Briefcase className="h-6 w-6" />}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{job.title}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Building2 className="h-4 w-4" />
                {job.companyName}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-56">{renderAction()}</div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> Location
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{job.location}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wallet className="h-3.5 w-3.5" /> Salary
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" /> Posted
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(job.createdAt)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" /> Deadline
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {job.applicationDeadline ? formatDate(job.applicationDeadline) : "Open"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="primary">{jobTypeLabel(job.jobType)}</Badge>
          <Badge variant="slate">{workModeLabel(job.workMode)}</Badge>
          {job.experience && <Badge variant="slate">{job.experience}</Badge>}
          {job.category && <Badge variant="slate">{job.category}</Badge>}
        </div>

        <div className="mt-8">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Job Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {job.description}
          </p>
        </div>

        {job.skills?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mt-6 text-center">
        <Link to="/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          ← Back to all jobs
        </Link>
      </div>

      {isSeeker && (
        <ApplyModal
          open={applyOpen}
          onClose={() => setApplyOpen(false)}
          job={job}
          onApplied={() => setHasApplied(true)}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;
