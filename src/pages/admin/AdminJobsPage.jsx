import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Briefcase, Eye } from "lucide-react";
import * as adminApi from "../../services/adminApi";
import { formatDate } from "../../utils/formatDate";
import { JOB_STATUSES } from "../../utils/constants";
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
      toast.success("Job status updated");
      load();
    } catch (err) {
      toast.error(err.message || "Failed to update job");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    setBusyId(deleteTarget._id);
    try {
      await adminApi.deleteJob(deleteTarget._id);
      toast.success("Job deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to delete job");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jobs</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Moderate every job listing on the platform.</p>
      </div>

      <Select
        placeholder="All Statuses"
        options={JOB_STATUSES}
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
        <EmptyState icon={Briefcase} title="No jobs found" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Recruiter</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
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
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{job.createdBy?.name || "—"}</td>
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
                              aria-label="View"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            <Select
                              options={JOB_STATUSES}
                              value=""
                              placeholder="Change status"
                              disabled={busyId === job._id}
                              onChange={(e) => changeStatus(job, e.target.value)}
                              className="!w-36 !py-1.5 text-xs"
                            />
                            <Button size="sm" variant="danger" onClick={() => setDeleteTarget(job)}>
                              Delete
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
        title="Delete this job?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminJobsPage;
