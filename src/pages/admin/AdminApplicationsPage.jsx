import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import * as adminApi from "../../services/adminApi";
import { useFormatters } from "../../hooks/useFormatters";
import { useApplicationStatusMasterOptions } from "../../hooks/useMasterDataOptions";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";

const AdminApplicationsPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const applicationStatusOptions = useApplicationStatusMasterOptions();
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    const params = { page, limit: 10 };
    if (statusFilter) params.status = statusFilter;
    adminApi
      .getApplications(params)
      .then((res) => {
        setApplications(res.data.applications);
        setPagination(res.data.pagination);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("admin.applications.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("admin.applications.subtitle")}</p>
      </div>

      <Select
        placeholder={t("admin.applications.allStatuses")}
        options={applicationStatusOptions}
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        containerClassName="max-w-xs"
      />

      {error ? (
        <ErrorState onRetry={load} />
      ) : !loading && applications.length === 0 ? (
        <EmptyState icon={FileText} title={t("admin.applications.noApplicationsTitle")} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("admin.applications.colApplicant")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.applications.colJob")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.applications.colRecruiter")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.applications.colStatus")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.applications.colApplied")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
                  : applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{app.applicant?.name}</p>
                          <p className="text-xs text-slate-400">{app.applicant?.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {app.job?.title}
                          <p className="text-xs text-slate-400">{app.job?.companyName}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{app.recruiter?.name || t("common.notAvailable")}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(app.createdAt)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AdminApplicationsPage;
