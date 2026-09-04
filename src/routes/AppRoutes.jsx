import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import PublicLayout from "../layouts/PublicLayout";
import SeekerLayout from "../layouts/SeekerLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../utils/constants";

// Public
const HomePage = lazy(() => import("../pages/public/HomePage"));
const JobsPage = lazy(() => import("../pages/public/JobsPage"));
const JobDetailsPage = lazy(() => import("../pages/public/JobDetailsPage"));
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/public/UnauthorizedPage"));

// Auth
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

// Seeker
const SeekerDashboardPage = lazy(() => import("../pages/seeker/SeekerDashboardPage"));
const SeekerProfilePage = lazy(() => import("../pages/seeker/SeekerProfilePage"));
const MyApplicationsPage = lazy(() => import("../pages/seeker/MyApplicationsPage"));
const ApplicationDetailsPage = lazy(() => import("../pages/seeker/ApplicationDetailsPage"));

// Recruiter
const RecruiterDashboardPage = lazy(() => import("../pages/recruiter/RecruiterDashboardPage"));
const RecruiterJobsPage = lazy(() => import("../pages/recruiter/RecruiterJobsPage"));
const CreateJobPage = lazy(() => import("../pages/recruiter/CreateJobPage"));
const EditJobPage = lazy(() => import("../pages/recruiter/EditJobPage"));
const RecruiterApplicationsPage = lazy(() => import("../pages/recruiter/RecruiterApplicationsPage"));
const RecruiterProfilePage = lazy(() => import("../pages/recruiter/RecruiterProfilePage"));

// Admin
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));
const AdminJobsPage = lazy(() => import("../pages/admin/AdminJobsPage"));
const AdminApplicationsPage = lazy(() => import("../pages/admin/AdminApplicationsPage"));

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={[ROLES.JOB_SEEKER]} />}>
          <Route element={<SeekerLayout />}>
            <Route path="/seeker/dashboard" element={<SeekerDashboardPage />} />
            <Route path="/seeker/profile" element={<SeekerProfilePage />} />
            <Route path="/seeker/applications" element={<MyApplicationsPage />} />
            <Route path="/seeker/applications/:id" element={<ApplicationDetailsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={[ROLES.RECRUITER]} />}>
          <Route element={<RecruiterLayout />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
            <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
            <Route path="/recruiter/jobs/:id/edit" element={<EditJobPage />} />
            <Route path="/recruiter/applications" element={<RecruiterApplicationsPage />} />
            <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
