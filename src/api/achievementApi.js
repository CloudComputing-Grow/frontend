import axios from "axios";

const api = axios.create({
  baseURL: "http://34.158.217.216:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAchievements = async () => {
  const response = await api.get("/achievements");
  return response.data;
};

export default api;