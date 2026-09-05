import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Briefcase, Pencil, Plus, Trash2, Eye } from "lucide-react";
import { fetchJobs, deleteJob } from "../../store/slices/jobSlice";
import { useFormatters } from "../../hooks/useFormatters";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";

const RecruiterJobsPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const dispatch = useDispatch();
  const { jobs, pagination, loading, error } = useSelector((state) => state.jobs);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => dispatch(fetchJobs({ mine: true, page, limit: 10, sort: "latest" }));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteJob(deleteTarget._id)).unwrap();
      toast.success(t("recruiter.jobs.deletedToast"));
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err || t("recruiter.jobs.deleteErrorToast"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("recruiter.jobs.title")}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("recruiter.jobs.subtitle")}</p>
        </div>
        <Link to="/recruiter/jobs/create">
          <Button icon={Plus}>{t("recruiter.jobs.postAJob")}</Button>
        </Link>
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : !loading && jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={t("recruiter.jobs.noJobsTitle")}
          description={t("recruiter.jobs.noJobsDesc")}
          actionLabel={t("recruiter.jobs.postAJob")}
          onAction={() => (window.location.href = "/recruiter/jobs/create")}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("recruiter.jobs.colTitle")}</th>
                  <th className="px-4 py-3 font-medium">{t("recruiter.jobs.colLocation")}</th>
                  <th className="px-4 py-3 font-medium">{t("recruiter.jobs.colStatus")}</th>
                  <th className="px-4 py-3 font-medium">{t("recruiter.jobs.colPosted")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
                  : jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{job.title}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{job.location}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={job.status} type="job" />
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(job.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                              aria-label={t("recruiter.jobs.viewAction")}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/recruiter/jobs/${job._id}/edit`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                              aria-label={t("recruiter.jobs.editAction")}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(job)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20"
                              aria-label={t("recruiter.jobs.deleteAction")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={t("recruiter.jobs.deleteTitle")}
        description={t("recruiter.jobs.deleteDesc", { title: deleteTarget?.title })}
        confirmLabel={t("common.delete")}
      />
    </div>
  );
};

export default RecruiterJobsPage;
