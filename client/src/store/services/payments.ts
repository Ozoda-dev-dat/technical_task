import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api } from "@shared/routes";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
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
    getPayments: builder.query<any[], void>({
      query: () => api.payments.list.path,
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentsApi;
