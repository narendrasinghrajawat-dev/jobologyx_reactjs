import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Building2, Calendar, FileText, MapPin } from "lucide-react";
import { fetchApplicationById, clearCurrentApplication } from "../../store/slices/applicationSlice";
import { formatDate } from "../../utils/formatDate";
import { APPLICATION_STATUSES } from "../../utils/constants";
import Card from "../../components/common/Card";
import StatusBadge from "../../components/common/StatusBadge";
import PageLoader from "../../components/common/PageLoader";
import ErrorState from "../../components/common/ErrorState";

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentApplication: app, loading, error } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchApplicationById(id));
    return () => dispatch(clearCurrentApplication());
  }, [id, dispatch]);

  if (loading) return <PageLoader />;
  if (error || !app) return <ErrorState title="Application not found" description="This application may have been removed." />;

  const statusIndex = APPLICATION_STATUSES.findIndex((s) => s.value === app.status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/seeker/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to applications
      </Link>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{app.job?.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Building2 className="h-4 w-4" /> {app.job?.companyName}
            </p>
            {app.job?.location && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4" /> {app.job.location}
              </p>
            )}
          </div>
          <StatusBadge status={app.status} />
        </div>

        {app.status !== "rejected" && (
          <div className="mt-6 flex items-center gap-2">
            {APPLICATION_STATUSES.filter((s) => s.value !== "rejected").map((step, idx) => (
              <div key={step.value} className="flex flex-1 items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full ${
                    idx <= statusIndex ? "bg-primary-600" : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />
              </div>
            ))}
          </div>
        )}
        {app.status !== "rejected" && (
          <div className="mt-1.5 flex justify-between text-xs text-slate-400">
            {APPLICATION_STATUSES.filter((s) => s.value !== "rejected").map((step) => (
              <span key={step.value}>{step.label}</span>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" /> Applied On
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(app.createdAt)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <FileText className="h-3.5 w-3.5" /> Resume
            </p>
            {app.resumeUrl ? (
              <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
                View submitted resume
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">—</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Cover Letter</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {app.coverLetter || "No cover letter submitted."}
          </p>
        </div>

        {app.job?._id && (
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Link to={`/jobs/${app.job._id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View original job posting →
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationDetailsPage;
