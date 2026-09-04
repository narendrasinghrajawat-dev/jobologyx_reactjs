import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "../components/common/PageLoader";

const RoleRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
