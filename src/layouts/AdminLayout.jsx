import { LayoutDashboard, Users, Briefcase, FileText } from "lucide-react";
import DashboardShell from "../components/layout/DashboardShell";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: FileText },
];

const AdminLayout = () => <DashboardShell navItems={navItems} />;

export default AdminLayout;
