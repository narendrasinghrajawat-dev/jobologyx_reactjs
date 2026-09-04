import { LayoutDashboard, FileText, User } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";

const navItems = [
  { to: "/seeker/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seeker/applications", label: "My Applications", icon: FileText },
  { to: "/seeker/profile", label: "Profile", icon: User },
];

const SeekerLayout = () => <DashboardShell navItems={navItems} />;

export default SeekerLayout;
