import { createFileRoute } from "@tanstack/react-router";
import AdminUsagePage from "@/pages/admin-usage-page";

export const Route = createFileRoute("/_app/admin/usage")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      breadcrumbs: [
        {
          link: "/admin",
          label: "Admin",
        },
        {
          link: "/admin/usage",
          label: "Usage",
        },
      ],
    };
  },
});

function RouteComponent() {
  return <AdminUsagePage />;
}
