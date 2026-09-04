import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, id, options = [], placeholder, className = "", containerClassName = "", ...rest },
  ref
) {
  const selectId = id || rest.name;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:text-slate-100 ${
          error ? "border-error-500" : "border-slate-300 dark:border-slate-700"
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-error-600 dark:text-error-500">{error}</p>}
    </div>
  );
});

export default Select;
