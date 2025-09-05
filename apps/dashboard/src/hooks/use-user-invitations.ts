import type { AdminRoutes } from "@paperjet/api/routes";
import type { UserInvitation } from "@paperjet/api/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const adminClient = hc<AdminRoutes>("/api/admin");

export function useUserInvitations() {
  const queryClient = useQueryClient();
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

  const acceptInvitation = async (invitationId: string, orgName: string) => {
    const { data: invResponse } = await authClient.organization.acceptInvitation({
      invitationId: invitationId,
    });
    await authClient.organization.setActive({
      organizationId: invResponse?.invitation.organizationId,
    });
    toast.success(`You've joined the ${orgName} Organization`);
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
  };

  const rejectInvitation = async (invitationId: string, orgName: string) => {
    await authClient.organization.rejectInvitation({
      invitationId: invitationId,
    });
    toast.success(`Invitation to ${orgName} rejected`);
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
  };

  return {
    acceptInvitation,
    rejectInvitation,
    invitations,
    isLoading,
    error,
  };
}
