import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Compass } from "lucide-react";
import Button from "../../components/common/Button";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
        <Compass className="h-8 w-8 text-primary-600 dark:text-primary-400" />
      </div>
      <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{t("notFound.code")}</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{t("notFound.title")}</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{t("notFound.description")}</p>
      <Link to="/">
        <Button className="mt-6">{t("common.goHome")}</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
