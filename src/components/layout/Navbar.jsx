import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { fetchMyProfile } from "../../store/slices/userSlice";
import { ROLES } from "../../utils/constants";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Avatar from "../common/Avatar";
import toast from "react-hot-toast";

const NAV_BY_ROLE = {
  guest: [
    { to: "/", labelKey: "nav.home" },
    { to: "/jobs", labelKey: "nav.jobs" },
  ],
  [ROLES.JOB_SEEKER]: [
    { to: "/", labelKey: "nav.home" },
    { to: "/jobs", labelKey: "nav.jobs" },
    { to: "/seeker/applications", labelKey: "nav.myApplications" },
    { to: "/seeker/dashboard", labelKey: "nav.dashboard" },
  ],
  [ROLES.RECRUITER]: [
    { to: "/recruiter/dashboard", labelKey: "nav.dashboard" },
    { to: "/recruiter/jobs", labelKey: "nav.myJobs" },
    { to: "/recruiter/applications", labelKey: "nav.applications" },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin/dashboard", labelKey: "nav.dashboard" },
    { to: "/admin/users", labelKey: "nav.users" },
    { to: "/admin/jobs", labelKey: "nav.jobs" },
    { to: "/admin/applications", labelKey: "nav.applications" },
  ],
};

const profilePathByRole = {
  [ROLES.JOB_SEEKER]: "/seeker/profile",
  [ROLES.RECRUITER]: "/recruiter/profile",
};

const Navbar = () => {
  const { t } = useTranslation();
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
    toast.success(t("nav.loggedOut"));
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
          <span className="text-lg">{t("common.appName")}</span>
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
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={profilePathByRole[user?.role] || "/"}
                className="flex items-center gap-2"
                title={t("nav.profile")}
              >
                <Avatar src={profile?.profileImage} name={user?.name} size="sm" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 md:hidden dark:text-slate-300"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={t("nav.toggleMenu")}
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
                {t(item.labelKey)}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                to={profilePathByRole[user?.role] || "/"}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("nav.profile")}
              </NavLink>
            )}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                {t("nav.logout")}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white"
                >
                  {t("nav.register")}
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
