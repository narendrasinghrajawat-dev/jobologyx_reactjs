import api from "./api";

export const getMasterData = () => api.get("/master-data");

export const getMasterDataByType = (type) => api.get(`/master-data/${type}`);
