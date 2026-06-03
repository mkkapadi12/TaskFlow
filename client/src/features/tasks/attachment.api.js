import { baseApi } from '@/app/baseApi';

export const attachmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskAttachments: builder.query({
      query: (taskId) => ({
        url: `/tasks/${taskId}/attachments`,
        method: 'GET',
      }),
      providesTags: (result, error, taskId) => [
        { type: 'Attachment', id: taskId },
      ],
    }),

    uploadTaskAttachments: builder.mutation({
      query: ({ taskId, formData }) => ({
        url: `/tasks/${taskId}/attachments`,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Attachment', id: taskId },
      ],
    }),

    deleteTaskAttachment: builder.mutation({
      query: ({ taskId, attachmentId }) => ({
        url: `/tasks/${taskId}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Attachment', id: taskId },
      ],
    }),
  }),
});

export const {
  useGetTaskAttachmentsQuery,
  useUploadTaskAttachmentsMutation,
  useDeleteTaskAttachmentMutation,
} = attachmentsApi;
