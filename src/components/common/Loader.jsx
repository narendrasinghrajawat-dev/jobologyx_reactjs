import { Loader2 } from "lucide-react";

const Loader = ({ size = 24, className = "" }) => (
  <Loader2 className={`animate-spin text-primary-600 ${className}`} size={size} />
);

export default Loader;
