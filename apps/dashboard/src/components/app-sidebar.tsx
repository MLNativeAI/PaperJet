import { Link } from "@tanstack/react-router";
import { BookOpen, FileText, Play, Settings, Shield } from "lucide-react";
import type * as React from "react";
import { useMemo } from "react";
import { OrgSwitcher } from "@/components/org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Workflows",
      url: "/",
      icon: FileText,
    },
    {
      title: "Executions",
      url: "/executions",
      icon: Play,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Admin",
      url: "/admin/config",
      icon: Shield,
      adminOnly: true,
      items: [
        {
          title: "Configuration",
          url: "/admin/config",
        },
        {
          title: "Usage",
          url: "/admin/usage",
        },
      ],
    },
    {
      title: "Documentation",
      url: "https://docs.getpaperjet.com/",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img src="/logo.png" alt="PaperJet" className="h-8 w-8" />
          <span className="font-semibold text-lg">PaperJet</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <OrgSwitcher />
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isExternal = item.url.startsWith("http");
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton hidden={item.adminOnly && !isAdmin} asChild>
                    {isExternal ? (
                      <a
                        href={item.url}
                        className="font-medium flex items-center gap-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link to={item.url} className="font-medium flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
