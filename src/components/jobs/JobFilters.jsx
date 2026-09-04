import { Search, X } from "lucide-react";
import { JOB_TYPES, WORK_MODES, SORT_OPTIONS } from "../../utils/constants";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const JobFilters = ({ filters, onChange, onClear }) => {
  const set = (key) => (e) => onChange({ [key]: e.target.value });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search title, company, skills..."
          value={filters.search}
          onChange={set("search")}
          containerClassName="lg:col-span-2"
          endAdornment={<Search className="h-4 w-4 text-slate-400" />}
        />
        <Input placeholder="Location" value={filters.location} onChange={set("location")} />
        <Select
          placeholder="Job Type"
          options={JOB_TYPES}
          value={filters.jobType}
          onChange={set("jobType")}
        />
        <Select
          placeholder="Work Mode"
          options={WORK_MODES}
          value={filters.workMode}
          onChange={set("workMode")}
        />
        <Input placeholder="Category" value={filters.category} onChange={set("category")} />
        <Input placeholder="Experience (e.g. 2-4 years)" value={filters.experience} onChange={set("experience")} />
        <Select placeholder="Sort by" options={SORT_OPTIONS} value={filters.sort} onChange={set("sort")} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-xs">
        <Input
          type="number"
          min="0"
          placeholder="Min salary"
          value={filters.salaryMin}
          onChange={set("salaryMin")}
        />
        <Input
          type="number"
          min="0"
          placeholder="Max salary"
          value={filters.salaryMax}
          onChange={set("salaryMax")}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;
