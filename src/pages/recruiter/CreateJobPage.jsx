import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { createJob } from "../../store/slices/jobSlice";
import { fetchMyProfile } from "../../store/slices/userSlice";
import JobForm from "../../components/jobs/JobForm";

const CreateJobPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  const handleSubmit = async (payload) => {
    try {
      await dispatch(createJob(payload)).unwrap();
      toast.success(t("recruiter.createJob.createdToast"));
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err || t("recruiter.createJob.createErrorToast"));
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("recruiter.createJob.title")}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("recruiter.createJob.subtitle")}</p>
      </div>
      <JobForm onSubmit={handleSubmit} submitLabel={t("jobForm.publishJob")} />
    </div>
  );
};

export default CreateJobPage;
