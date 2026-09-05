import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

const ErrorState = ({ title, description, onRetry, className = "" }) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-error-200 bg-error-50/50 px-6 py-14 text-center dark:border-error-900 dark:bg-error-950/20 ${className}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-900/40">
        <AlertTriangle className="h-6 w-6 text-error-600 dark:text-error-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title ?? t("common.somethingWentWrong")}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description ?? t("common.pleaseTryAgain")}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          {t("common.tryAgain")}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
