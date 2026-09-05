import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Briefcase } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Briefcase className="h-4 w-4" />
            </span>
            {t("common.appName")}
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white">
              {t("nav.home")}
            </Link>
            <Link to="/jobs" className="hover:text-slate-900 dark:hover:text-white">
              {t("footer.browseJobs")}
            </Link>
            <Link to="/register" className="hover:text-slate-900 dark:hover:text-white">
              {t("footer.createAccount")}
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
