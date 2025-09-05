import OrgMembers from "@/components/settings/org-members";
import OrgNameLogo from "@/components/settings/org-name-logo";
import UserInvitations from "@/components/settings/user-invitations";

export default function OrganizationPage() {
  return (
    <div className="space-y-17 pt-8">
      <UserInvitations />
      <OrgNameLogo />
      <OrgMembers />
    </div>
  );
}
