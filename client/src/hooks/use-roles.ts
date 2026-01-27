import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useRoles() {
  return useQuery({
    queryKey: [api.roles.list.path],
    queryFn: async () => {
      const res = await apiRequest('GET', api.roles.list.path);
      return api.roles.list.responses[200].parse(await res.json());
    },
  });
}
