import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FileText, Clock, Star, XCircle, ArrowRight } from "lucide-react";
import { fetchMyApplications } from "../../store/slices/applicationSlice";
import { fetchMyProfile } from "../../store/slices/userSlice";
import { useFormatters } from "../../hooks/useFormatters";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import PageLoader from "../../components/common/PageLoader";

const PROFILE_FIELDS = ["phone", "bio", "location", "skills", "resumeUrl", "profileImage"];

const SeekerDashboardPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);
  const { profile } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyApplications({ limit: 50 }));
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const stats = useMemo(() => {
    const counts = { total: applications.length, reviewing: 0, shortlisted: 0, rejected: 0 };
    applications.forEach((app) => {
      if (app.status === "reviewing") counts.reviewing += 1;
      if (app.status === "shortlisted") counts.shortlisted += 1;
      if (app.status === "rejected") counts.rejected += 1;
    });
    return counts;
  }, [applications]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const filled = PROFILE_FIELDS.filter((field) => {
      const value = profile[field];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }).length;
    return Math.round((filled / PROFILE_FIELDS.length) * 100);
  }, [profile]);

  const STAT_CARDS = [
    { key: "total", label: t("seeker.dashboard.statApplications"), icon: FileText, color: "text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400" },
    { key: "reviewing", label: t("seeker.dashboard.statReviewing"), icon: Clock, color: "text-warning-600 bg-warning-50 dark:bg-warning-500/10 dark:text-warning-500" },
    { key: "shortlisted", label: t("seeker.dashboard.statShortlisted"), icon: Star, color: "text-success-600 bg-success-50 dark:bg-success-500/10 dark:text-success-500" },
    { key: "rejected", label: t("seeker.dashboard.statRejected"), icon: XCircle, color: "text-error-600 bg-error-50 dark:bg-error-500/10 dark:text-error-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("seeker.dashboard.welcome", { name: user?.name?.split(" ")[0] })}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("seeker.dashboard.subtitle")}</p>
      </div>

      {profileCompletion < 100 && (
        <Card className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {t("seeker.dashboard.profileComplete", { percent: profileCompletion })}
            </p>
            <div className="mt-2 h-2 w-full max-w-xs rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-2 rounded-full bg-primary-600 transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
          <Link
            to="/seeker/profile"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {t("seeker.dashboard.completeProfile")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Card key={card.key} className="p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{stats[card.key]}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t("seeker.dashboard.recentApplications")}</h2>
          <Link to="/seeker/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            {t("home.viewAllJobs")}
          </Link>
        </div>

        {loading ? (
          <PageLoader />
        ) : applications.length === 0 ? (
          <EmptyState
            title={t("seeker.dashboard.noApplicationsTitle")}
            description={t("seeker.dashboard.noApplicationsDesc")}
            actionLabel={t("seeker.dashboard.browseJobs")}
            onAction={() => (window.location.href = "/jobs")}
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.slice(0, 5).map((app) => (
              <Link
                key={app._id}
                to={`/seeker/applications/${app._id}`}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{app.job?.title}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {app.job?.companyName} · {t("seeker.applicationDetails.appliedOn")} {formatDate(app.createdAt)}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SeekerDashboardPage;
