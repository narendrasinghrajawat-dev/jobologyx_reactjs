const Card = ({ children, className = "", as: Component = "div", ...rest }) => (
  <Component
    className={`rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    {...rest}
  >
    {children}
  </Component>
);

export default Card;
