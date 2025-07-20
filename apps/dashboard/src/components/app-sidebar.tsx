import { BookOpen, FileText, Play, Settings, Shield } from "lucide-react";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
      title: "Runs",
      url: "/runs",
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
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isAdmin = user?.role === "admin";

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img src="/logo.png" alt="PaperJet" className="h-8 w-8" />
          <span className="font-semibold text-lg">PaperJet</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton hidden={item.adminOnly && !isAdmin} asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* <SidebarGroup> */}
        {/*   <SidebarGroupContent> */}
        {/*     <SidebarMenu> */}
        {/*       {data.navMain.map((item) => ( */}
        {/*         <SidebarMenuItem key={item.title} hidden={item.adminOnly && !isAdmin}> */}
        {/*           <SidebarMenuButton asChild> */}
        {/*             <a */}
        {/*               href={item.url} */}
        {/*               target={item.url.startsWith("http") ? "_blank" : undefined} */}
        {/*               rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined} */}
        {/*             > */}
        {/*               <item.icon className="h-4 w-4" /> */}
        {/*               {item.title} */}
        {/*             </a> */}
        {/*           </SidebarMenuButton> */}
        {/*         </SidebarMenuItem> */}
        {/*       ))} */}
        {/*     </SidebarMenu> */}
        {/*   </SidebarGroupContent> */}
        {/* </SidebarGroup> */}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
