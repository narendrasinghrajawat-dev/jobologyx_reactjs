import api from "./api";

export const applyToJob = (payload) => api.post("/applications", payload);

export const getMyApplications = (params) => api.get("/applications/my", { params });

export const getRecruiterApplications = (params) => api.get("/applications/recruiter", { params });

export const getApplicationById = (id) => api.get(`/applications/${id}`);

export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status });
