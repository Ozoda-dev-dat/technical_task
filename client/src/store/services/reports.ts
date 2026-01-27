import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api } from "@shared/routes";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
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
    getReports: builder.query<any[], void>({
      query: () => api.reports.list.path,
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
