import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LogoBanner } from "@/components/logo-banner";
import { isAdminSetupRequired } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const { isSetupRequired } = await isAdminSetupRequired();

    if (isSetupRequired) {
      throw redirect({
        to: "/admin/setup",
      });
    }

    const { data: session } = await authClient.getSession();
    if (session) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10 gap-8">
      <LogoBanner />
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
