import { LayoutDashboard, FileText, User } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";

const navItems = [
  { to: "/seeker/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/seeker/applications", labelKey: "nav.myApplications", icon: FileText },
  { to: "/seeker/profile", labelKey: "nav.profile", icon: User },
];

const SeekerLayout = () => <DashboardShell navItems={navItems} />;

export default SeekerLayout;
