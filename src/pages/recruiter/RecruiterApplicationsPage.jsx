import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import { fetchRecruiterApplications, updateApplicationStatus } from "../../store/slices/applicationSlice";
import * as jobApi from "../../services/jobApi";
import { useFormatters } from "../../hooks/useFormatters";
import { useApplicationStatusMasterOptions } from "../../hooks/useMasterDataOptions";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";
import Avatar from "../../components/common/Avatar";

const RecruiterApplicationsPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const applicationStatusOptions = useApplicationStatusMasterOptions();
  const dispatch = useDispatch();
  const { applications, pagination, loading, error } = useSelector((state) => state.applications);
  const [page, setPage] = useState(1);
  const [jobFilter, setJobFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [myJobs, setMyJobs] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    jobApi.getJobs({ mine: true, limit: 50 }).then((res) => setMyJobs(res.data.jobs));
  }, []);

  const load = () => {
    const params = { page, limit: 10 };
    if (jobFilter) params.job = jobFilter;
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchRecruiterApplications(params));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, jobFilter, statusFilter]);

  const handleStatusChange = async (app, status) => {
    setUpdatingId(app._id);
    try {
      await dispatch(updateApplicationStatus({ id: app._id, status })).unwrap();
      toast.success(t("recruiter.applications.statusUpdatedToast"));
    } catch (err) {
      toast.error(err || t("recruiter.applications.statusErrorToast"));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("recruiter.applications.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("recruiter.applications.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:max-w-xl">
        <Select
          placeholder={t("recruiter.applications.allJobs")}
          options={myJobs.map((j) => ({ value: j._id, label: j.title }))}
          value={jobFilter}
          onChange={(e) => {
            setJobFilter(e.target.value);
            setPage(1);
          }}
        />
        <Select
          placeholder={t("recruiter.applications.allStatuses")}
          options={applicationStatusOptions}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : !loading && applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("recruiter.applications.noApplicationsTitle")}
          description={t("recruiter.applications.noApplicationsDesc")}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("recruiter.applications.colApplicant")}</th>
                  <th className="px-4 py-3 font-medium">{t("recruiter.applications.colJob")}</th>
                  <th className="px-4 py-3 font-medium">{t("recruiter.applications.colApplied")}</th>
                  <th className="px-4 py-3 font-medium">{t("recruiter.applications.colResume")}</th>
                  <th className="px-4 py-3 font-medium">{t("recruiter.applications.colStatus")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
                  : applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={app.applicant?.name} size="sm" />
                            <div className="min-w-0">
                              <span className="block truncate font-medium text-slate-800 dark:text-slate-200">
                                {app.applicant?.name}
                              </span>
                              <span className="block truncate text-xs text-slate-400">{app.applicant?.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{app.job?.title}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(app.createdAt)}</td>
                        <td className="px-4 py-3">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                            >
                              {t("recruiter.applications.viewResume")}
                            </a>
                          ) : (
                            t("common.notAvailable")
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={app.status} />
                            <Select
                              options={applicationStatusOptions}
                              value=""
                              placeholder={t("recruiter.applications.changeStatus")}
                              disabled={updatingId === app._id}
                              onChange={(e) => e.target.value && handleStatusChange(app, e.target.value)}
                              className="!w-32 !py-1.5 text-xs"
                            />
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
    </div>
  );
};

export default RecruiterApplicationsPage;
