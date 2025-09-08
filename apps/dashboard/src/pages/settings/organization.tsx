import OrgMembers from "@/components/settings/org-members";
import OrgNameLogo from "@/components/settings/org-name-logo";
import UserInvitations from "@/components/settings/user-invitations";
import { useRole } from "@/hooks/use-role";

export default function OrganizationPage() {
  const { member } = useRole();
  return (
    <div className="space-y-17 pt-8">
      <UserInvitations member={member} />
      <OrgNameLogo member={member} />
      <OrgMembers member={member} />
    </div>
  );
}
