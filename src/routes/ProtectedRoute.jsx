import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "../components/common/PageLoader";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
