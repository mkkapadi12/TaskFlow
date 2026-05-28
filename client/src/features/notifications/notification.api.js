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

    // Feed endpoints
    getNotifications: builder.query({
      query: ({ limit = 50, offset = 0 } = {}) => ({
        url: '/notifications/feed',
        method: 'GET',
        params: { limit, offset },
      }),
      providesTags: ['Notification'],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
      ) {
        try {
          await cacheDataLoaded;

          const userId = getState()?.auth?.user?.id;
          if (!userId) return;

          const { getSocket } = await import('@/lib/socket');
          const socket = getSocket(userId);

          const handleNotification = (newNotif) => {
            updateCachedData((draft) => {
              if (draft && draft.data) {
                const exists = draft.data.some((n) => n.id === newNotif.id);
                if (!exists) {
                  draft.data.unshift(newNotif);
                  draft.unreadCount = (draft.unreadCount || 0) + 1;
                }
              }
            });
          };

          socket.on('notification', handleNotification);

          await cacheEntryRemoved;
          socket.off('notification', handleNotification);
        } catch (err) {
          console.error('[Socket] RTK Query integration error:', err);
        }
      },
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
