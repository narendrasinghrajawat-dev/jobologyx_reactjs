import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Briefcase, Calendar, MapPin, Wallet, Building2, Clock } from "lucide-react";
import { fetchJobById, clearCurrentJob } from "../../store/slices/jobSlice";
import { getMyApplications } from "../../services/applicationApi";
import { ROLES } from "../../utils/constants";
import { useFormatters } from "../../hooks/useFormatters";
import PageLoader from "../../components/common/PageLoader";
import ErrorState from "../../components/common/ErrorState";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ApplyModal from "../../components/applications/ApplyModal";

const formatSalary = (min, max, t) => {
  if (!min && !max) return t("jobDetails.notDisclosed");
  const fmt = (n) => (n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n.toLocaleString());
  const perYear = t("jobDetails.perYear");
  if (min && max) return `₹${fmt(min)} - ₹${fmt(max)} ${perYear}`;
  return `₹${fmt(min || max)} ${perYear}`;
};

const JobDetailsPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
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
        <ErrorState title={t("jobDetails.jobNotFoundTitle")} description={t("jobDetails.jobNotFoundDesc")} />
      </div>
    );
  }

  const isClosed = job.status !== "active";
  const deadlinePassed = job.applicationDeadline && new Date(job.applicationDeadline) < new Date();

  const renderAction = () => {
    if (!isAuthenticated) {
      return (
        <Button className="w-full" onClick={() => navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } })}>
          {t("jobDetails.loginToApply")}
        </Button>
      );
    }
    if (!isSeeker) return null;
    if (isClosed || deadlinePassed) {
      return (
        <Button className="w-full" disabled>
          {t("jobDetails.applicationsClosed")}
        </Button>
      );
    }
    if (hasApplied) {
      return (
        <Button className="w-full" variant="secondary" disabled>
          {t("jobDetails.alreadyApplied")}
        </Button>
      );
    }
    return (
      <Button className="w-full" loading={checkingApplied} onClick={() => setApplyOpen(true)}>
        {t("jobDetails.applyNow")}
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
              <MapPin className="h-3.5 w-3.5" /> {t("jobDetails.location")}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{job.location}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wallet className="h-3.5 w-3.5" /> {t("jobDetails.salary")}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {formatSalary(job.salaryMin, job.salaryMax, t)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" /> {t("jobDetails.posted")}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(job.createdAt)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" /> {t("jobDetails.deadline")}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {job.applicationDeadline ? formatDate(job.applicationDeadline) : t("jobDetails.open")}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="primary">{t(`options.jobType.${job.jobType}`, job.jobType)}</Badge>
          <Badge variant="slate">{t(`options.workMode.${job.workMode}`, job.workMode)}</Badge>
          {job.experience && <Badge variant="slate">{job.experience}</Badge>}
          {job.category && <Badge variant="slate">{job.category}</Badge>}
        </div>

        <div className="mt-8">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t("jobDetails.descriptionTitle")}</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {job.description}
          </p>
        </div>

        {job.skills?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t("jobDetails.skillsTitle")}</h2>
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
          {t("jobDetails.backToJobs")}
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
