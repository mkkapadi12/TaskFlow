import { baseApi } from '@/app/baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationSettings: builder.query({
      query: () => ({ url: '/notifications/settings', method: 'GET' }),
      providesTags: ['NotificationSettings'],
    }),
    updateNotificationSettings: builder.mutation({
      query: (body) => ({
        url: '/notifications/settings',
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: ['NotificationSettings'],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationApi;
