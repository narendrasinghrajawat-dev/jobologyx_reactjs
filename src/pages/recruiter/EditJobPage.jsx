import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchJobById, updateJob, clearCurrentJob } from "../../store/slices/jobSlice";
import { fetchMyProfile } from "../../store/slices/userSlice";
import JobForm from "../../components/jobs/JobForm";
import PageLoader from "../../components/common/PageLoader";
import ErrorState from "../../components/common/ErrorState";

const EditJobPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob: job, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(fetchMyProfile());
    return () => dispatch(clearCurrentJob());
  }, [id, dispatch]);

  const defaultValues = useMemo(() => {
    if (!job) return undefined;
    return {
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      workMode: job.workMode,
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      experience: job.experience || "",
      skillsInput: (job.skills || []).join(", "),
      category: job.category || "",
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.slice(0, 10) : "",
      status: job.status,
    };
  }, [job]);

  const handleSubmit = async (payload) => {
    try {
      await dispatch(updateJob({ id, payload })).unwrap();
      toast.success("Job updated");
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err || "Failed to update job");
    }
  };

  if (loading || !defaultValues) return <PageLoader />;
  if (error) return <ErrorState title="Job not found" />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Job</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update the details for this listing.</p>
      </div>
      <JobForm defaultValues={defaultValues} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
};

export default EditJobPage;
