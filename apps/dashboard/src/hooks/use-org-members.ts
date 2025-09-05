import { useQuery } from "@tanstack/react-query";
import type { InvitationStatus } from "better-auth/plugins/organization";
import { authClient } from "@/lib/auth-client";
import { getInvitationSendDate } from "@/lib/utils/date";

export type OrgMember = {
  id: string;
  email: string;
  role: "member" | "admin" | "owner";
  createdAt: Date;
  organizationId: string;
};

export type OrgInvitation = {
  id: string;
  email: string;
  role: "member" | "admin" | "owner";
  status: InvitationStatus;
  issuedAt: Date;
};

export type OrgMemberInvitation = OrgMember | OrgInvitation;

export function isOrgMember(item: OrgMemberInvitation): item is OrgMember {
  return (item as OrgInvitation).status === undefined;
}

export function isOrgInvitation(item: OrgMemberInvitation): item is OrgInvitation {
  return (item as OrgInvitation).status !== undefined;
}

export function useOrgMembers() {
  const { data: session } = authClient.useSession();
  const { data: orgData, isLoading } = useQuery({
    queryKey: ["organization-members"],
    queryFn: async () => {
      const activeOrgId = session?.session.activeOrganizationId;
      if (!activeOrgId) {
        throw new Error("Active org not found");
      }

      const { data, error } = await authClient.organization.getFullOrganization({
        query: {
          organizationId: activeOrgId,
        },
      });

      if (error) {
        throw new Error("Active org not found");
      }

      const { data: activeMember, error: memberError } = await authClient.organization.getActiveMember();

      if (memberError) {
        throw new Error("Active member not found");
      }

      const invitations: OrgInvitation[] = (
        data?.invitations.map((invitation) => ({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          issuedAt: getInvitationSendDate(invitation.expiresAt),
        })) || []
      ).filter((inv) => inv.status === "pending");

      const members: OrgMember[] =
        data?.members.map((member) => ({
          id: member.userId,
          email: member.user.email,
          role: member.role,
          createdAt: member.createdAt,
          organizationId: member.organizationId,
        })) || [];

      return {
        membersAndInvitations: [...invitations, ...members],
        activeMember,
        isAdmin: activeMember?.role === "admin" || activeMember?.role === "owner",
      };
    },
  });

  return {
    orgMemberInvitations: orgData?.membersAndInvitations || [],
    activeMember: orgData?.activeMember,
    isAdmin: orgData?.isAdmin || false,
    isLoading,
  };
}
