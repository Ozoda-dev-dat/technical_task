import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function usePayments() {
  return useQuery({
    queryKey: [api.payments.list.path],
    queryFn: async () => {
      const res = await apiRequest('GET', api.payments.list.path);
      return api.payments.list.responses[200].parse(await res.json());
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: [api.reports.list.path],
    queryFn: async () => {
      const res = await apiRequest('GET', api.reports.list.path);
      return api.reports.list.responses[200].parse(await res.json());
    },
  });
}
