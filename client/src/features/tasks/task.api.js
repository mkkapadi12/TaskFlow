import { baseApi } from '@/app/baseApi';

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTasks: builder.query({
      query: () => ({ url: '/tasks/my', method: 'GET' }),
      providesTags: ['Task'],
    }),

    getTasksByProject: builder.query({
      query: ({ projectId, status }) => ({
        url: `/tasks/project/${projectId}`,
        method: 'GET',
        params: status ? { status } : undefined,
      }),
      providesTags: (result, error, { projectId }) => [
        { type: 'Task', id: `project-${projectId}` },
      ],
    }),

    getTaskById: builder.query({
      query: (taskId) => ({ url: `/tasks/${taskId}`, method: 'GET' }),
      providesTags: (result, error, taskId) => [{ type: 'Task', id: taskId }],
    }),

    createTask: builder.mutation({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        'Task',
        { type: 'Task', id: `project-${projectId}` },
        { type: 'Project', id: String(projectId) },
      ],
    }),

    updateTask: builder.mutation({
      query: ({ taskId, ...body }) => ({
        url: `/tasks/${taskId}`,
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: (result, error, { taskId, projectId }) => [
        'Task',
        { type: 'Task', id: taskId },
        { type: 'Task', id: `project-${projectId}` },
        { type: 'Project', id: String(projectId) },
      ],
    }),

    updateTaskStatus: builder.mutation({
      query: ({ taskId, status }) => ({
        url: `/tasks/${taskId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { taskId, projectId }) => [
        'Task',
        { type: 'Task', id: taskId },
        { type: 'Task', id: `project-${projectId}` },
        { type: 'Project', id: String(projectId) },
      ],
    }),

    verifyTask: builder.mutation({
      query: ({ taskId, approve }) => ({
        url: `/tasks/${taskId}/verify`,
        method: 'PATCH',
        data: { approve },
      }),
      invalidatesTags: (result, error, { taskId, projectId }) => [
        'Task',
        { type: 'Task', id: taskId },
        { type: 'Task', id: `project-${projectId}` },
        { type: 'Project', id: String(projectId) },
      ],
    }),

    deleteTask: builder.mutation({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { taskId, projectId }) => [
        'Task',
        { type: 'Task', id: taskId },
        { type: 'Task', id: `project-${projectId}` },
        { type: 'Project', id: String(projectId) },
      ],
    }),

    getOverdueTasks: builder.query({
      query: () => ({ url: '/tasks/overdue', method: 'GET' }),
      providesTags: ['Task'],
    }),
  }),
});

export const {
  useGetMyTasksQuery,
  useGetTasksByProjectQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useVerifyTaskMutation,
  useDeleteTaskMutation,
  useGetOverdueTasksQuery,
} = tasksApi;
