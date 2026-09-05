import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Search,
  Briefcase,
  Code2,
  Palette,
  Megaphone,
  LineChart,
  Headset,
  ShieldCheck,
  Zap,
  Users,
  FileEdit,
  Send,
  CheckCircle2,
} from "lucide-react";
import { fetchJobs } from "../../store/slices/jobSlice";
import JobCard from "../../components/jobs/JobCard";
import { JobCardSkeleton } from "../../components/common/Skeleton";
import Button from "../../components/common/Button";

const CATEGORIES = [
  { labelKey: "home.categories.engineering", icon: Code2, category: "Engineering" },
  { labelKey: "home.categories.design", icon: Palette, category: "Design" },
  { labelKey: "home.categories.marketing", icon: Megaphone, category: "Marketing" },
  { labelKey: "home.categories.sales", icon: LineChart, category: "Sales" },
  { labelKey: "home.categories.customerSupport", icon: Headset, category: "Customer Support" },
  { labelKey: "home.categories.operations", icon: Briefcase, category: "Operations" },
];

const WHY_CHOOSE = [
  { icon: ShieldCheck, titleKey: "home.why.verifiedTitle", descKey: "home.why.verifiedDesc" },
  { icon: Zap, titleKey: "home.why.fastTitle", descKey: "home.why.fastDesc" },
  { icon: Users, titleKey: "home.why.bothTitle", descKey: "home.why.bothDesc" },
];

const HOW_IT_WORKS = [
  { icon: FileEdit, titleKey: "home.how.step1Title", descKey: "home.how.step1Desc" },
  { icon: Send, titleKey: "home.how.step2Title", descKey: "home.how.step2Desc" },
  { icon: CheckCircle2, titleKey: "home.how.step3Title", descKey: "home.how.step3Desc" },
];

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchJobs({ limit: 6, sort: "latest" }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchTerm ? `/jobs?search=${encodeURIComponent(searchTerm)}` : "/jobs");
  };

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-primary-50 to-white dark:border-slate-800 dark:from-primary-950/30 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            {t("home.heroSubtitle")}
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl gap-2 rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("home.searchPlaceholder")}
                className="w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              />
            </div>
            <Button type="submit" size="lg">
              {t("home.searchButton")}
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">{t("home.popularCategories")}</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.category}
              to={`/jobs?category=${encodeURIComponent(cat.category)}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-center transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <cat.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t(cat.labelKey)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("home.featuredJobs")}</h2>
            <Link to="/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              {t("home.viewAllJobs")}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
              : jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">{t("home.whyChoose")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {WHY_CHOOSE.map((item) => (
            <div key={item.titleKey} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{t(item.titleKey)}</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">{t("home.howItWorks")}</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.titleKey} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{t(step.titleKey)}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t("home.ctaTitle")}</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">{t("home.ctaSubtitle")}</p>
        <Link to="/register">
          <Button size="lg" className="mt-6">
            {t("home.ctaButton")}
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
