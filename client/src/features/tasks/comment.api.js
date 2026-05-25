import { baseApi } from '@/app/baseApi';

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskComments: builder.query({
      query: (taskId) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'GET',
      }),
      providesTags: (result, error, taskId) => [{ type: 'Comment', id: taskId }],
    }),

    createTaskComment: builder.mutation({
      query: ({ taskId, content }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        data: { content },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Comment', id: taskId },
      ],
    }),

    deleteTaskComment: builder.mutation({
      query: ({ taskId, commentId }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Comment', id: taskId },
      ],
    }),
  }),
});

export const {
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
} = commentsApi;
