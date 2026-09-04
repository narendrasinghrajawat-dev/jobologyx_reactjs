import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../../components/common/Button";

const UnauthorizedPage = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-50 dark:bg-error-900/30">
      <ShieldAlert className="h-8 w-8 text-error-600 dark:text-error-500" />
    </div>
    <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
    <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
      You don't have permission to view this page.
    </p>
    <Link to="/">
      <Button className="mt-6">Go Home</Button>
    </Link>
  </div>
);

export default UnauthorizedPage;
