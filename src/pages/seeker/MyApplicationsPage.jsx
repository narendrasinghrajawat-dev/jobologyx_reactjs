import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FileText, ChevronRight } from "lucide-react";
import { fetchMyApplications } from "../../store/slices/applicationSlice";
import { useFormatters } from "../../hooks/useFormatters";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";

const MyApplicationsPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const dispatch = useDispatch();
  const { applications, pagination, loading, error } = useSelector((state) => state.applications);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyApplications({ page, limit: 10 }));
  }, [dispatch, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("seeker.applications.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("seeker.applications.subtitle")}</p>
      </div>

      {error ? (
        <ErrorState onRetry={() => dispatch(fetchMyApplications({ page, limit: 10 }))} />
      ) : !loading && applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("seeker.applications.noApplicationsTitle")}
          description={t("seeker.applications.noApplicationsDesc")}
          actionLabel={t("seeker.applications.browseJobs")}
          onAction={() => (window.location.href = "/jobs")}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("seeker.applications.colJob")}</th>
                  <th className="px-4 py-3 font-medium">{t("seeker.applications.colCompany")}</th>
                  <th className="px-4 py-3 font-medium">{t("seeker.applications.colApplied")}</th>
                  <th className="px-4 py-3 font-medium">{t("seeker.applications.colStatus")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
                  : applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                          {app.job?.title || t("common.notAvailable")}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{app.job?.companyName || t("common.notAvailable")}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(app.createdAt)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/seeker/applications/${app._id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                          >
                            {t("seeker.applications.view")} <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
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

export default MyApplicationsPage;
