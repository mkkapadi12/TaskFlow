import axios from "axios";
import { store } from "@/app/store";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// attach token to every request
// and let axios auto-detect Content-Type for FormData (multipart boundary)
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// 401 → auto logout
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // store.dispatch(logout());
    }
    return Promise.reject(err);
  },
);

export default axiosInstance;
