import type { Organization } from "better-auth/plugins/organization";
import { ChevronsUpDown, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import OrgLogoWithFallback from "@/components/org-logo-with-fallback";

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {activeOrganization && <OrgLogoWithFallback activeOrganization={activeOrganization} />}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization ? `${activeOrganization?.name} ` : "..."}{" "}
                </span>
                <span className="truncate text-xs">Free</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
            {/* {teams.map((team, index) => ( */}
            {/*   <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2"> */}
            {/*     <div className="flex size-6 items-center justify-center rounded-md border"> */}
            {/*       <team.logo className="size-3.5 shrink-0" /> */}
            {/*     </div> */}
            {/*     {team.name} */}
            {/*     <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
            {/*   </DropdownMenuItem> */}
            {/* ))} */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
