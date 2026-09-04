import api from "./api";

export const getDashboardStats = () => api.get("/admin/dashboard");

export const getUsers = (params) => api.get("/admin/users", { params });

export const updateUserStatus = (id, isActive) =>
  api.patch(`/admin/users/${id}/status`, { isActive });

export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getJobs = (params) => api.get("/admin/jobs", { params });

export const updateJobStatus = (id, status) => api.patch(`/admin/jobs/${id}/status`, { status });

export const deleteJob = (id) => api.delete(`/admin/jobs/${id}`);

export const getApplications = (params) => api.get("/admin/applications", { params });
