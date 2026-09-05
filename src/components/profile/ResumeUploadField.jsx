import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, ExternalLink, FileText, Upload } from "lucide-react";
import Button from "../common/Button";
import ResumePreviewModal from "./ResumePreviewModal";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const ResumeUploadField = ({ resumeUrl, resumeFileName, uploading, onUpload }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      onUpload(null, t("profileFields.invalidResumeType"));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onUpload(null, t("profileFields.resumeTooLarge", { size: MAX_SIZE_MB }));
      return;
    }
    onUpload(file);
  };

  const displayName = resumeFileName || t("profileFields.currentResume");

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300" title={resumeUrl ? displayName : undefined}>
            {resumeUrl ? displayName : t("profileFields.noResumeUploaded")}
          </p>
          {resumeUrl && (
            <div className="mt-0.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1 text-xs text-primary-600 hover:underline dark:text-primary-400"
              >
                <Eye className="h-3 w-3" />
                {t("profileFields.view")}
              </button>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-primary-600 hover:underline dark:text-primary-400"
              >
                <ExternalLink className="h-3 w-3" />
                {t("profileFields.openInNewTab")}
              </a>
            </div>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={Upload}
        loading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {resumeUrl ? t("profileFields.replaceResume") : t("profileFields.uploadResume")}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
      {resumeUrl && (
        <ResumePreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          resumeUrl={resumeUrl}
          fileName={displayName}
        />
      )}
    </div>
  );
};

export default ResumeUploadField;
