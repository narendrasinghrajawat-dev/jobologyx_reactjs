const VARIANTS = {
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  primary: "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  success: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500",
  error: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500",
  info: "bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-500",
};

const Badge = ({ variant = "slate", className = "", children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
