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
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth";
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
      url: "/admin",
      icon: Shield,
      adminOnly: true,
    },
    {
      title: "Documentation",
      url: "https://docs.getpaperjet.com/",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const isAdminOrOwner = useMemo(() => user?.role === "admin" || user?.role === "owner", [user?.role]);

  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <OrgSwitcher />
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isExternal = item.url.startsWith("http");
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton hidden={item.adminOnly && !isAdminOrOwner} asChild>
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
                      <Link
                        to={item.url}
                        activeProps={{
                          className: "bg-sidebar-accent text-sidebar-accent-foreground",
                        }}
                        className="font-medium flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
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
