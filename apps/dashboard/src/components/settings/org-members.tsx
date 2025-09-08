import type { Member } from "better-auth/plugins";
import InviteDialog from "@/components/settings/invite-dialog";
import { OrgMembersTable } from "@/components/settings/org-members-table";
import { useOrgMembers } from "@/hooks/use-org-members";

export default function OrgMembers({ member }: { member: Member | undefined }) {
  const { orgMemberInvitations, isLoading } = useOrgMembers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">Manage who has access to your organization</p>
        </div>
        {member && member.role === "admin" && <InviteDialog />}
      </div>
      <div className="pt-4">
        {member?.role && (
          <OrgMembersTable
            data={orgMemberInvitations}
            userId={member.userId}
            isAdmin={member.role === "admin"}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
