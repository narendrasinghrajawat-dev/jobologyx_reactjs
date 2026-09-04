import api from "./api";

export const getMyProfile = () => api.get("/users/me");

export const updateMyProfile = (payload) => api.patch("/users/me", payload);

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/users/me/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/users/me/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadCompanyLogo = (file) => {
  const formData = new FormData();
  formData.append("logo", file);
  return api.post("/users/me/company-logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
