import axios from "axios";
import { logout } from "@/features/auth/auth.slice";

// Lazily resolved to avoid circular dependency:
// store → baseApi → axios → store
const getStore = () => import("@/app/store").then((m) => m.store);

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// attach token to every request
// and let axios auto-detect Content-Type for FormData (multipart boundary)
axiosInstance.interceptors.request.use(async (config) => {
  const store = await getStore();
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
  async (err) => {
    if (err.response?.status === 401) {
      const store = await getStore();
      store.dispatch(logout());
    }
    return Promise.reject(err);
  },
);

export default axiosInstance;
