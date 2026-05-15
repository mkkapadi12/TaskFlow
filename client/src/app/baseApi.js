import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "@/lib/axios";

// custom baseQuery using our axios instance (not fetchBaseQuery)
const axiosBaseQuery =
  () =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axiosInstance({ url, method, data, params });
      return { data: result.data };
    } catch (err) {
      return {
        error: {
          status: err.response?.status,
          message: err.response?.data?.message || err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User", "Project", "Task"],
  endpoints: () => ({}), // feature apis inject here
});
