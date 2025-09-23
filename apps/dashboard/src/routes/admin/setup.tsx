import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAdminSetupRequired } from "@/lib/api/admin";
import AdminSetupPage from "@/pages/admin-setup-page";

export const Route = createFileRoute("/admin/setup")({
  beforeLoad: async () => {
    const { adminAccountExists } = await isAdminSetupRequired();

    if (adminAccountExists) {
      throw redirect({
        to: "/",
      });
    }
    return {
      breadcrumbs: [
        {
          link: "/admin/setup",
          label: "Admin Setup",
        },
      ],
    };
  },
  component: AdminSetupPage,
});
