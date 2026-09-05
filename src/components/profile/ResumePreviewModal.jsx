import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";

const ResumePreviewModal = ({ open, onClose, resumeUrl, fileName }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title={fileName || t("profileFields.currentResume")} className="max-w-4xl">
      <div className="h-[70vh] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
        <iframe src={resumeUrl} title={fileName || t("profileFields.currentResume")} className="h-full w-full" />
      </div>
      <div className="mt-4 flex justify-end">
        <a href={resumeUrl} target="_blank" rel="noreferrer">
          <Button type="button" variant="secondary" icon={ExternalLink}>
            {t("profileFields.openInNewTab")}
          </Button>
        </a>
      </div>
    </Modal>
  );
};

export default ResumePreviewModal;
