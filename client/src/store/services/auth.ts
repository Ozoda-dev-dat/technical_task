import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api, type LoginRequest, type LoginResponse } from "@shared/routes";

export const authApi = createApi({
  reducerPath: "authApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => api.auth.me.path,
      providesTags: ["User"],
      transformResponse: (response: any, meta) => {
        if (meta?.response?.status === 401) return null;
        return response;
      },
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: api.auth.login.path,
        method: api.auth.login.method,
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData("getMe", undefined, () => data.user)
          );
        } catch {}
      },
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation } = authApi;
