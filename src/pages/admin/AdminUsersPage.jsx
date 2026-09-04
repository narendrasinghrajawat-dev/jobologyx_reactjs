import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import * as adminApi from "../../services/adminApi";
import { formatDate } from "../../utils/formatDate";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import { TableRowSkeleton } from "../../components/common/Skeleton";

const ROLE_OPTIONS = [
  { value: "job_seeker", label: "Job Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(false);
    const params = { page, limit: 10 };
    if (roleFilter) params.role = roleFilter;
    adminApi
      .getUsers(params)
      .then((res) => {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, roleFilter]);

  const toggleStatus = async (user) => {
    setBusyId(user._id);
    try {
      await adminApi.updateUserStatus(user._id, !user.isActive);
      toast.success(`User ${user.isActive ? "deactivated" : "activated"}`);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    setBusyId(deleteTarget._id);
    try {
      await adminApi.deleteUser(deleteTarget._id);
      toast.success("User deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage all platform users.</p>
      </div>

      <Select
        placeholder="All Roles"
        options={ROLE_OPTIONS}
        value={roleFilter}
        onChange={(e) => {
          setRoleFilter(e.target.value);
          setPage(1);
        }}
        containerClassName="max-w-xs"
      />

      {error ? (
        <ErrorState onRetry={load} />
      ) : !loading && users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
                  : users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{user.name}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant="slate">{ROLE_OPTIONS.find((r) => r.value === user.role)?.label || user.role}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={user.isActive} type="user" />
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3">
                          {user.role !== "admin" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                loading={busyId === user._id}
                                onClick={() => toggleStatus(user)}
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(user)}>
                                Delete
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={!!busyId}
        title="Delete this user?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default AdminUsersPage;
