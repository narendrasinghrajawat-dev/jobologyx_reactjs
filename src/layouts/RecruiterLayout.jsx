import { LayoutDashboard, Briefcase, FileText, User } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";

const navItems = [
  { to: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/recruiter/jobs", label: "My Jobs", icon: Briefcase },
  { to: "/recruiter/applications", label: "Applications", icon: FileText },
  { to: "/recruiter/profile", label: "Profile", icon: User },
];

const RecruiterLayout = () => <DashboardShell navItems={navItems} />;

export default RecruiterLayout;
