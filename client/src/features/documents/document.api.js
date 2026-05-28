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
        { type: 'Document', id: 'LIST' },
      ],
    }),

    getGlobalDocuments: builder.query({
      query: () => ({
        url: '/documents',
        method: 'GET',
      }),
      providesTags: () => [{ type: 'Document', id: 'LIST' }],
    }),

    uploadDocuments: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/projects/${projectId}/documents`,
        method: 'POST',
        data: formData, // FormData — axios handles Content-Type automatically
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Document', id: projectId },
        { type: 'Document', id: 'LIST' },
      ],
    }),

    deleteDocument: builder.mutation({
      query: ({ projectId, documentId }) => ({
        url: `/projects/${projectId}/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Document', id: projectId },
        { type: 'Document', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetGlobalDocumentsQuery,
  useUploadDocumentsMutation,
  useDeleteDocumentMutation,
} = documentApi;
