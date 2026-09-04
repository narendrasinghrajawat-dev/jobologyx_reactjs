import { Loader2 } from "lucide-react";

const ButtonLoader = ({ className = "" }) => (
  <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
);

export default ButtonLoader;
