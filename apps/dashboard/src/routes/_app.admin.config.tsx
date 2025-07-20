import { createFileRoute } from "@tanstack/react-router";
import AdminConfigPage from "@/pages/admin-config-page";

export const Route = createFileRoute("/_app/admin/config")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminConfigPage />;
}
