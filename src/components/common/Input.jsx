import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, id, endAdornment, className = "", containerClassName = "", ...rest },
  ref
) {
  const inputId = id || rest.name;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            endAdornment ? "pr-11" : ""
          } ${error ? "border-error-500" : "border-slate-300 dark:border-slate-700"} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">{endAdornment}</div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error-600 dark:text-error-500">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
