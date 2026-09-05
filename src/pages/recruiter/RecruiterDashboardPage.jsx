import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Briefcase, CheckCircle2, FileText, Clock } from "lucide-react";
import { fetchJobs } from "../../store/slices/jobSlice";
import { fetchRecruiterApplications } from "../../store/slices/applicationSlice";
import { useFormatters } from "../../hooks/useFormatters";
import { useApplicationStatusOptions } from "../../hooks/useOptions";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";

const STAT_COLOR = "text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400";

const RecruiterDashboardPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const applicationStatusOptions = useApplicationStatusOptions();
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.jobs);
  const { applications } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobs({ mine: true, limit: 50 }));
    dispatch(fetchRecruiterApplications({ limit: 50 }));
  }, [dispatch]);

  const stats = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    const pending = applications.filter((a) => a.status === "applied" || a.status === "reviewing").length;
    return { totalJobs: jobs.length, activeJobs, totalApplications: applications.length, pending };
  }, [jobs, applications]);

  const chartData = useMemo(
    () =>
      applicationStatusOptions.map((s) => ({
        name: s.label,
        count: applications.filter((a) => a.status === s.value).length,
      })),
    [applications, applicationStatusOptions]
  );

  const STAT_CARDS = [
    { label: t("recruiter.dashboard.statTotalJobs"), value: stats.totalJobs, icon: Briefcase },
    { label: t("recruiter.dashboard.statActiveJobs"), value: stats.activeJobs, icon: CheckCircle2 },
    { label: t("recruiter.dashboard.statTotalApplications"), value: stats.totalApplications, icon: FileText },
    { label: t("recruiter.dashboard.statPendingReview"), value: stats.pending, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("recruiter.dashboard.welcome", { name: user?.name?.split(" ")[0] })}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("recruiter.dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Card key={card.label} className="p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${STAT_COLOR}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">{t("recruiter.dashboard.applicationsByStatus")}</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-400" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "none", fontSize: 13 }}
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t("recruiter.dashboard.recentJobs")}</h2>
            <Link to="/recruiter/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              {t("home.viewAllJobs")}
            </Link>
          </div>
          {jobs.length === 0 ? (
            <EmptyState title={t("recruiter.dashboard.noJobsTitle")} description={t("recruiter.dashboard.noJobsDesc")} />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{job.title}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {t("recruiter.dashboard.postedPrefix")} {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={job.status} type="job" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t("recruiter.dashboard.recentApplications")}</h2>
            <Link to="/recruiter/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              {t("home.viewAllJobs")}
            </Link>
          </div>
          {applications.length === 0 ? (
            <EmptyState title={t("recruiter.dashboard.noApplicationsTitle")} description={t("recruiter.dashboard.noApplicationsDesc")} />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.slice(0, 5).map((app) => (
                <div key={app._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{app.applicant?.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{app.job?.title}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
