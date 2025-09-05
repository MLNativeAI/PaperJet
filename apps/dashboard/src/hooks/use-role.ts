import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useRole() {
  const { data: member, isLoading } = useQuery({
    queryKey: ["role"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.getActiveMember();
      if (error) {
        throw new Error("Role not found");
      }
      return data;
    },
  });
  return { member, isLoading };
}
