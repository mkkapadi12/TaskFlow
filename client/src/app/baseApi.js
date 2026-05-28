import { createApi } from '@reduxjs/toolkit/query/react';

import { logout } from '@/features/auth/auth.slice';
import axiosInstance from '@/lib/axios';

// custom baseQuery using our axios instance (not fetchBaseQuery)
const axiosBaseQuery =
  () =>
  async ({ url, method = 'GET', data, params, headers = {} }, api) => {
    try {
      const token = api.getState()?.auth?.token;
      const combinedHeaders = {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers: combinedHeaders,
      });
      return { data: result.data };
    } catch (err) {
      if (err.response?.status === 401) {
        api.dispatch(logout());
        api.dispatch(baseApi.util.resetApiState());
      }
      return {
        error: {
          status: err.response?.status,
          message: err.response?.data?.message || err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'User',
    'Project',
    'Task',
    'NotificationSettings',
    'Document',
    'Comment',
    'Notification',
  ],
  endpoints: () => ({}), // feature apis inject here
});
