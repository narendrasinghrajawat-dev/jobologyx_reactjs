import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users, Briefcase, CheckCircle2, FileText, UserCheck, UserCog, Clock } from "lucide-react";
import * as adminApi from "../../services/adminApi";
import Card from "../../components/common/Card";
import PageLoader from "../../components/common/PageLoader";
import ErrorState from "../../components/common/ErrorState";

const COLORS = ["#4f46e5", "#22c55e"];

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    adminApi
      .getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <PageLoader />;
  if (error || !stats) return <ErrorState onRetry={load} />;

  const STAT_CARDS = [
    { label: t("admin.dashboard.statTotalUsers"), value: stats.totalUsers, icon: Users },
    { label: t("admin.dashboard.statJobSeekers"), value: stats.totalJobSeekers, icon: UserCheck },
    { label: t("admin.dashboard.statRecruiters"), value: stats.totalRecruiters, icon: UserCog },
    { label: t("admin.dashboard.statTotalJobs"), value: stats.totalJobs, icon: Briefcase },
    { label: t("admin.dashboard.statActiveJobs"), value: stats.activeJobs, icon: CheckCircle2 },
    { label: t("admin.dashboard.statTotalApplications"), value: stats.totalApplications, icon: FileText },
    { label: t("admin.dashboard.statPendingApplications"), value: stats.pendingApplications, icon: Clock },
  ];

  const userSplit = [
    { name: t("admin.dashboard.statJobSeekers"), value: stats.totalJobSeekers },
    { name: t("admin.dashboard.statRecruiters"), value: stats.totalRecruiters },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("admin.dashboard.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("admin.dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Card key={card.label} className="p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">{t("admin.dashboard.userBaseSplit")}</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={userSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {userSplit.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", fontSize: 13 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
