import { LayoutDashboard, Users, Briefcase, FileText } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";

const navItems = [
  { to: "/admin/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/admin/users", labelKey: "nav.users", icon: Users },
  { to: "/admin/jobs", labelKey: "nav.jobs", icon: Briefcase },
  { to: "/admin/applications", labelKey: "nav.applications", icon: FileText },
];

const AdminLayout = () => <DashboardShell navItems={navItems} />;

export default AdminLayout;
