import { baseApi } from "@/app/baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProjects: builder.query({
      query: () => ({ url: "/projects/my", method: "GET" }),
      providesTags: ["Project"],
    }),

    getProjectDetails: builder.query({
      query: (projectId) => ({ url: `/projects/${projectId}`, method: "GET" }),
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
      ],
    }),

    createProject: builder.mutation({
      query: (body) => ({
        url: "/projects/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Project"],
    }),

    updateProject: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        "Project",
        { type: "Project", id: projectId },
      ],
    }),

    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    getProjectMembers: builder.query({
      query: (projectId) => ({
        url: `/projects/${projectId}/members`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "Project", id: `${projectId}-members` },
      ],
    }),

    addProjectMember: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/add-member`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Project", id: `${projectId}-members` },
      ],
    }),

    updateMemberRole: builder.mutation({
      query: ({ projectId, userId, role }) => ({
        url: `/projects/${projectId}/member/${userId}`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Project", id: `${projectId}-members` },
      ],
    }),

    removeProjectMember: builder.mutation({
      query: ({ projectId, userId, reason }) => ({
        url: `/projects/${projectId}/member/${userId}`,
        method: "DELETE",
        data: { reason },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Project", id: `${projectId}-members` },
      ],
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useGetProjectDetailsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveProjectMemberMutation,
} = projectApi;
