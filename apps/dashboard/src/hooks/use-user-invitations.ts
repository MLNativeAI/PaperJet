import type { AdminRoutes } from "@paperjet/api/routes";
import type { UserInvitation } from "@paperjet/api/types";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";

const adminClient = hc<AdminRoutes>("/api/admin");

export function useUserInvitations() {
  const {
    data: invitations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-invitations"],
    queryFn: async () => {
      const response = await adminClient.invitations.$get({});

      if (!response.ok) {
        console.log("Failed to fetch invitations");
        throw new Error("Failed to fetch invitations");
      }

      return response.json() as unknown as UserInvitation[];
    },
  });
  return {
    invitations,
    isLoading,
    error,
  };
}
