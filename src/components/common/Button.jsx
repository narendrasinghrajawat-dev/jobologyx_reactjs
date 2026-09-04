import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 disabled:bg-primary-300",
  secondary:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-primary-500 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800",
  danger:
    "bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500 disabled:bg-error-300",
  ghost:
    "text-slate-600 hover:bg-slate-100 focus-visible:ring-primary-500 dark:text-slate-300 dark:hover:bg-slate-800",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  icon: Icon,
  type = "button",
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  );
};

export default Button;
