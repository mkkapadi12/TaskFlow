import { baseApi } from '@/app/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({ url: '/users/profile', method: 'GET' }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/users/profile',
        method: 'PUT',
        data: body, // Can be FormData or object
      }),
      invalidatesTags: ['User'],
    }),

    getAllUsers: builder.query({
      query: (search) => ({
        url: '/users',
        method: 'GET',
        params: search ? { search } : undefined,
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
} = userApi;
