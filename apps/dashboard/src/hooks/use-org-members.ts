import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { InvitationStatus } from "better-auth/plugins/organization";

interface OrgMember {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: "active";
  avatar?: string;
}

interface OrgInvitation {
  id: string;
  email: string;
  role: string;
  status: InvitationStatus;
}

export type OrgMemberInvitation = OrgMember | OrgInvitation;

export function isOrgMember(item: OrgMemberInvitation): item is OrgMember {
  return item.status === "active";
}

export function isOrgInvitation(item: OrgMemberInvitation): item is OrgInvitation {
  return item.status !== "active";
}

export function useOrgMembers() {
  const { data: session } = authClient.useSession();
  const [membersInvitations, setMembersInvitations] = useState<OrgMemberInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const activeOrgId = session?.session.activeOrganizationId;
      if (!activeOrgId) {
        setMembersInvitations([]);
        setLoading(false);
        return;
      }

      const { data, error } = await authClient.organization.getFullOrganization({
        query: {
          organizationId: activeOrgId,
        },
      });

      if (error) {
        console.error("Error fetching organization data:", error);
        setMembersInvitations([]);
        setLoading(false);
        return;
      }

      const invitations: OrgInvitation[] =
        data?.invitations.map((invitation) => ({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
        })) || [];

      const members: OrgMember[] =
        data?.members.map((member) => ({
          id: member.userId,
          email: member.user.email,
          name: member.user.name,
          role: member.role,
          status: "active",
          avatar: member.user.image,
        })) || [];

      setMembersInvitations([...invitations, ...members]);
      setLoading(false);
    };

    fetchData();
  }, [session?.session.activeOrganizationId]);

  const refreshMembers = async () => {
    // Re-fetch the data
    const activeOrgId = session?.session.activeOrganizationId;
    if (!activeOrgId) {
      setMembersInvitations([]);
      return;
    }

    setLoading(true);
    const { data, error } = await authClient.organization.getFullOrganization({
      query: {
        organizationId: activeOrgId,
      },
    });

    if (!error && data) {
      const invitations: OrgInvitation[] =
        data?.invitations.map((invitation) => ({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
        })) || [];

      const members: OrgMember[] =
        data?.members.map((member) => ({
          id: member.userId,
          email: member.user.email,
          name: member.user.name,
          role: member.role,
          status: "active",
          avatar: member.user.image,
        })) || [];

      setMembersInvitations([...invitations, ...members]);
    }
    setLoading(false);
  };

  return {
    membersInvitations,
    loading,
    refreshMembers,
  };
}
