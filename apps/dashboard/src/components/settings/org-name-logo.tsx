import OrgLogoWithFallback from "@/components/org-logo-with-fallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function OrgNameLogo() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  return (
    <div className="flex flex-col space-y-2">
      <div>
        <h2 className="text-xl font-bold">Organization Information</h2>
        <p className="text-muted-foreground">Manage your organization's details and settings</p>
      </div>
      <div className="flex flex-col border border-1 p-4 gap-4">
        <div className="flex flex-col sm:flex-row gap-6 ">
          <div className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              {activeOrganization && <OrgLogoWithFallback activeOrganization={activeOrganization} />}
            </Avatar>
            <Button variant="outline" size="sm">
              Change Logo
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input id="org-name" placeholder="Acme Inc." defaultValue="Acme Inc." className="w-80" />
        </div>
        <div className="flex w-full pt-4 justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
