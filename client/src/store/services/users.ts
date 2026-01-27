import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api, buildUrl, type CreateUserRequest, type UpdateUserRequest } from "@shared/routes";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["UserList"],
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => api.users.list.path,
      providesTags: ["UserList"],
    }),
    getUser: builder.query<any, number>({
      query: (id) => buildUrl(api.users.get.path, { id }),
    }),
    createUser: builder.mutation<any, CreateUserRequest>({
      query: (data) => ({
        url: api.users.create.path,
        method: api.users.create.method,
        body: data,
      }),
      invalidatesTags: ["UserList"],
    }),
    updateUser: builder.mutation<any, { id: number } & UpdateUserRequest>({
      query: ({ id, ...data }) => ({
        url: buildUrl(api.users.update.path, { id }),
        method: api.users.update.method,
        body: data,
      }),
      invalidatesTags: ["UserList"],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: buildUrl(api.users.delete.path, { id }),
        method: api.users.delete.method,
      }),
      invalidatesTags: ["UserList"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
