import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api } from "@shared/routes";

export const rolesApi = createApi({
  reducerPath: "rolesApi",
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
  endpoints: (builder) => ({
    getRoles: builder.query<any[], void>({
      query: () => api.roles.list.path,
    }),
  }),
});

export const { useGetRolesQuery } = rolesApi;
