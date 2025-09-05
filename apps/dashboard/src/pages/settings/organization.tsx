import OrgMembers from "@/components/settings/org-members";
import OrgNameLogo from "@/components/settings/org-name-logo";

export default function OrganizationPage() {
  return (
    <div className="space-y-8 pt-8">
      <OrgNameLogo />
      <OrgMembers />
    </div>
  );
}
