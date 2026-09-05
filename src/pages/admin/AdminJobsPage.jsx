import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Briefcase, Eye } from "lucide-react";
import * as adminApi from "../../services/adminApi";
import { useFormatters } from "../../hooks/useFormatters";
import { useJobStatusMasterOptions } from "../../hooks/useMasterDataOptions";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";

const AdminJobsPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const jobStatusOptions = useJobStatusMasterOptions();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(false);
    const params = { page, limit: 10 };
    if (statusFilter) params.status = statusFilter;
    adminApi
      .getJobs(params)
      .then((res) => {
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, statusFilter]);

  const changeStatus = async (job, status) => {
    if (!status || status === job.status) return;
    setBusyId(job._id);
    try {
      await adminApi.updateJobStatus(job._id, status);
      toast.success(t("admin.jobs.statusUpdatedToast"));
      load();
    } catch (err) {
      toast.error(err.message || t("admin.jobs.statusErrorToast"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    setBusyId(deleteTarget._id);
    try {
      await adminApi.deleteJob(deleteTarget._id);
      toast.success(t("admin.jobs.deletedToast"));
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || t("admin.jobs.deleteErrorToast"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("admin.jobs.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("admin.jobs.subtitle")}</p>
      </div>

      <Select
        placeholder={t("admin.jobs.allStatuses")}
        options={jobStatusOptions}
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        containerClassName="max-w-xs"
      />

      {error ? (
        <ErrorState onRetry={load} />
      ) : !loading && jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title={t("admin.jobs.noJobsTitle")} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colJob")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colCompany")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colRecruiter")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colStatus")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colCreated")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
                  : jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{job.title}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{job.companyName}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{job.createdBy?.name || t("common.notAvailable")}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={job.status} type="job" />
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(job.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/jobs/${job._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                              aria-label={t("common.view")}
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            <Select
                              options={jobStatusOptions}
                              value=""
                              placeholder={t("admin.jobs.changeStatus")}
                              disabled={busyId === job._id}
                              onChange={(e) => changeStatus(job, e.target.value)}
                              className="!w-36 !py-1.5 text-xs"
                            />
                            <Button size="sm" variant="danger" onClick={() => setDeleteTarget(job)}>
                              {t("common.delete")}
                            </Button>
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
        loading={!!busyId}
        title={t("admin.jobs.deleteTitle")}
        description={t("admin.jobs.deleteDesc", { title: deleteTarget?.title })}
        confirmLabel={t("common.delete")}
      />
    </div>
  );
};

export default AdminJobsPage;
