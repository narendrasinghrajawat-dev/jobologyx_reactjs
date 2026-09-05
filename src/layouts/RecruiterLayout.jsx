import { LayoutDashboard, Briefcase, FileText, User } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";

const navItems = [
  { to: "/recruiter/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/recruiter/jobs", labelKey: "nav.myJobs", icon: Briefcase },
  { to: "/recruiter/applications", labelKey: "nav.applications", icon: FileText },
  { to: "/recruiter/profile", labelKey: "nav.profile", icon: User },
];

const RecruiterLayout = () => <DashboardShell navItems={navItems} />;

export default RecruiterLayout;
