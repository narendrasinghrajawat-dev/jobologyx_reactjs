import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { fetchMyProfile } from "../../store/slices/userSlice";
import { ROLES } from "../../utils/constants";
import ThemeToggle from "./ThemeToggle";
import Avatar from "../common/Avatar";
import toast from "react-hot-toast";

const NAV_BY_ROLE = {
  guest: [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
  ],
  [ROLES.JOB_SEEKER]: [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/seeker/applications", label: "My Applications" },
    { to: "/seeker/dashboard", label: "Dashboard" },
  ],
  [ROLES.RECRUITER]: [
    { to: "/recruiter/dashboard", label: "Dashboard" },
    { to: "/recruiter/jobs", label: "My Jobs" },
    { to: "/recruiter/applications", label: "Applications" },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/jobs", label: "Jobs" },
    { to: "/admin/applications", label: "Applications" },
  ],
};

const profilePathByRole = {
  [ROLES.JOB_SEEKER]: "/seeker/profile",
  [ROLES.RECRUITER]: "/recruiter/profile",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const profile = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !profile) {
      dispatch(fetchMyProfile());
    }
  }, [isAuthenticated, profile, dispatch]);

  const navItems = NAV_BY_ROLE[isAuthenticated ? user?.role : "guest"] || NAV_BY_ROLE.guest;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Briefcase className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg">JobologyX</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={profilePathByRole[user?.role] || "/"}
                className="flex items-center gap-2"
                title="Profile"
              >
                <Avatar src={profile?.profileImage} name={user?.name} size="sm" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 md:hidden dark:text-slate-300"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 px-4 pb-4 pt-2 md:hidden dark:border-slate-800">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                to={profilePathByRole[user?.role] || "/"}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Profile
              </NavLink>
            )}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
            <ThemeToggle />
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
