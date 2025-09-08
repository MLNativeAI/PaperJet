import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import type { Member } from "better-auth/plugins";

export function useRole() {
  const { data: member, isLoading } = useQuery({
    queryKey: ["role"],
    queryFn: async () => {
      const { data, error } = await authClient.organization.getActiveMember();
      if (error) {
        throw new Error("Role not found");
      }
      return data as Member;
    },
  });
  return { member, isLoading };
}
