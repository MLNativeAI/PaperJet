import { createFileRoute } from "@tanstack/react-router";
import AdminConfigPage from "@/pages/admin-config-page";

export const Route = createFileRoute("/_app/admin/models")({
  component: AdminConfigPage,
  beforeLoad: () => {
    return {
      breadcrumbs: [
        {
          link: "/admin",
          label: "Admin",
        },
        {
          link: "/admin/models",
          label: "Model Configuration",
        },
      ],
    };
  },
});
