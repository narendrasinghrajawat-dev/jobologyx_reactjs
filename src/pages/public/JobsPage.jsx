import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SearchX } from "lucide-react";
import { fetchJobs } from "../../store/slices/jobSlice";
import { useDebounce } from "../../hooks/useDebounce";
import JobFilters from "../../components/jobs/JobFilters";
import JobCard from "../../components/jobs/JobCard";
import { JobCardSkeleton } from "../../components/common/Skeleton";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";

const EMPTY_FILTERS = {
  search: "",
  location: "",
  jobType: "",
  workMode: "",
  category: "",
  experience: "",
  salaryMin: "",
  salaryMax: "",
  sort: "latest",
};

const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, pagination, loading, error } = useSelector((state) => state.jobs);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFiltersState] = useState(() => ({
    ...EMPTY_FILTERS,
    ...Object.fromEntries(searchParams.entries()),
  }));
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const debouncedFilters = useDebounce(filters, 400);

  const setFilters = (partial) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

  const clearFilters = () => {
    setFiltersState(EMPTY_FILTERS);
    setPage(1);
  };

  const queryParams = useMemo(() => {
    const params = { page, limit: 10 };
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return params;
  }, [debouncedFilters, page]);

  useEffect(() => {
    dispatch(fetchJobs(queryParams));
    const nextSearchParams = {};
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) nextSearchParams[key] = String(value);
    });
    setSearchParams(nextSearchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Browse Jobs</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {pagination.total} opportunities waiting for you
        </p>
      </div>

      <div className="mb-6">
        <JobFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
      </div>

      {error ? (
        <ErrorState onRetry={() => dispatch(fetchJobs(queryParams))} />
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No jobs found"
          description="Try adjusting your search or filters to find more opportunities."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default JobsPage;
