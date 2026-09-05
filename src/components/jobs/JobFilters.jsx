import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { useJobTypeOptions, useWorkModeOptions, useSortOptions } from "../../hooks/useOptions";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const JobFilters = ({ filters, onChange, onClear }) => {
  const { t } = useTranslation();
  const jobTypeOptions = useJobTypeOptions();
  const workModeOptions = useWorkModeOptions();
  const sortOptions = useSortOptions();

  const set = (key) => (e) => onChange({ [key]: e.target.value });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder={t("jobs.searchPlaceholder")}
          value={filters.search}
          onChange={set("search")}
          containerClassName="lg:col-span-2"
          endAdornment={<Search className="h-4 w-4 text-slate-400" />}
        />
        <Input placeholder={t("jobs.locationPlaceholder")} value={filters.location} onChange={set("location")} />
        <Select
          placeholder={t("jobs.jobTypePlaceholder")}
          options={jobTypeOptions}
          value={filters.jobType}
          onChange={set("jobType")}
        />
        <Select
          placeholder={t("jobs.workModePlaceholder")}
          options={workModeOptions}
          value={filters.workMode}
          onChange={set("workMode")}
        />
        <Input placeholder={t("jobs.categoryPlaceholder")} value={filters.category} onChange={set("category")} />
        <Input placeholder={t("jobs.experiencePlaceholder")} value={filters.experience} onChange={set("experience")} />
        <Select placeholder={t("jobs.sortPlaceholder")} options={sortOptions} value={filters.sort} onChange={set("sort")} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-xs">
        <Input
          type="number"
          min="0"
          placeholder={t("jobs.minSalaryPlaceholder")}
          value={filters.salaryMin}
          onChange={set("salaryMin")}
        />
        <Input
          type="number"
          min="0"
          placeholder={t("jobs.maxSalaryPlaceholder")}
          value={filters.salaryMax}
          onChange={set("salaryMax")}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-3.5 w-3.5" />
          {t("jobs.clearFilters")}
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;
