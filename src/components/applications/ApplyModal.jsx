import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import { applyToJob } from "../../store/slices/applicationSlice";
import Modal from "../common/Modal";
import Textarea from "../common/Textarea";
import Button from "../common/Button";

const ApplyModal = ({ open, onClose, job, onApplied }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const resumeUrl = useSelector((state) => state.auth.user?.resumeUrl);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setCoverLetter("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(applyToJob({ jobId: job._id, coverLetter })).unwrap();
      toast.success(t("applyModal.successToast"));
      handleClose();
      onApplied?.();
    } catch (err) {
      toast.error(err || t("applyModal.errorToast"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!resumeUrl) {
    return (
      <Modal open={open} onClose={handleClose} title={t("applyModal.resumeRequiredTitle")} className="max-w-md">
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("applyModal.resumeRequiredDesc")}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Link to="/seeker/profile">
            <Button>{t("applyModal.goToProfile")}</Button>
          </Link>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t("applyModal.applyToTitle", { title: job?.title || "" })}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("applyModal.at")} <span className="font-medium text-slate-700 dark:text-slate-300">{job?.companyName}</span>
        </p>

        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <FileText className="h-4 w-4 shrink-0 text-primary-600" />
          {t("applyModal.resumeNotice")}
        </div>

        <Textarea
          label={t("applyModal.coverLetterLabel")}
          placeholder={t("applyModal.coverLetterPlaceholder")}
          rows={5}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" loading={submitting}>
            {t("applyModal.submit")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
