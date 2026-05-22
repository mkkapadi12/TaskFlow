// client/src/features/documents/document.api.js
import { baseApi } from '@/app/baseApi';

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: (projectId) => ({
        url: `/projects/${projectId}/documents`,
        method: 'GET',
      }),
      providesTags: (result, error, projectId) => [
        { type: 'Document', id: projectId },
      ],
    }),

    uploadDocuments: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/projects/${projectId}/documents`,
        method: 'POST',
        data: formData, // FormData — axios handles Content-Type automatically
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Document', id: projectId },
      ],
    }),

    deleteDocument: builder.mutation({
      query: ({ projectId, documentId }) => ({
        url: `/projects/${projectId}/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Document', id: projectId },
      ],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentsMutation,
  useDeleteDocumentMutation,
} = documentApi;
