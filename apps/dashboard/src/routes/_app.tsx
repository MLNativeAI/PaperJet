import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_app")({
  component: PathlessLayoutComponent,
  beforeLoad: async ({ context }) => {
    if (!context.serverInfo.adminAccountExists) {
      throw redirect({
        to: "/admin/setup",
      });
    }
    if (!context.session) {
      throw redirect({
        to: "/auth/sign-in",
      });
    }
  },
});

function PathlessLayoutComponent() {
  const context = useRouterState({
    select: (state) => {
      const lastMatch = state.matches[state.matches.length - 1];
      return lastMatch?.context || {};
    },
  });

  const { useFullWidth } = context;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SiteHeader />
          {useFullWidth ? (
            <Outlet />
          ) : (
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
