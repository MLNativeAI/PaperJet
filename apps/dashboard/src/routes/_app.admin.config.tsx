import { createFileRoute } from "@tanstack/react-router";
import AdminConfigPage from "@/pages/admin-config-page";

export const Route = createFileRoute("/_app/admin/config")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      breadcrumbs: [
        {
          link: "/admin",
          label: "Admin",
        },
        {
          link: "/admin/config",
          label: "Configuration",
        },
      ],
    };
  },
});

function RouteComponent() {
  return <AdminConfigPage />;
}
