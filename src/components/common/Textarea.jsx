import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, error, id, rows = 4, className = "", containerClassName = "", ...rest },
  ref
) {
  const areaId = id || rest.name;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={rows}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
          error ? "border-error-500" : "border-slate-300 dark:border-slate-700"
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <p className="mt-1.5 text-sm text-error-600 dark:text-error-500">{error}</p>}
    </div>
  );
});

export default Textarea;
