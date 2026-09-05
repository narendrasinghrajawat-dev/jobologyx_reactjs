import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Upload } from "lucide-react";
import Button from "../common/Button";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const ResumeUploadField = ({ resumeUrl, uploading, onUpload }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

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

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {resumeUrl ? t("profileFields.currentResume") : t("profileFields.noResumeUploaded")}
          </p>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary-600 hover:underline dark:text-primary-400"
            >
              {t("profileFields.viewResume")}
            </a>
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
    </div>
  );
};

export default ResumeUploadField;
