const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

const Avatar = ({ src, name, size = "md", className = "" }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={`${SIZES[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${SIZES[size]} flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
