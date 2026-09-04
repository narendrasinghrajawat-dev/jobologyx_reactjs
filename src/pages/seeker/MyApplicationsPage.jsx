import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, ChevronRight } from "lucide-react";
import { fetchMyApplications } from "../../store/slices/applicationSlice";
import { formatDate } from "../../utils/formatDate";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";

const MyApplicationsPage = () => {
  const dispatch = useDispatch();
  const { applications, pagination, loading, error } = useSelector((state) => state.applications);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyApplications({ page, limit: 10 }));
  }, [dispatch, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Applications</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track the status of every job you've applied to.
        </p>
      </div>

      {error ? (
        <ErrorState onRetry={() => dispatch(fetchMyApplications({ page, limit: 10 }))} />
      ) : !loading && applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Browse open roles and apply to start tracking your progress here."
          actionLabel="Browse Jobs"
          onAction={() => (window.location.href = "/jobs")}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Applied Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
                  : applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                          {app.job?.title || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{app.job?.companyName || "—"}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(app.createdAt)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/seeker/applications/${app._id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                          >
                            View <ChevronRight className="h-3.5 w-3.5" />
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
