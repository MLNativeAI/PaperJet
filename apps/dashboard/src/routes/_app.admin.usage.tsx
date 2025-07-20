import { createFileRoute } from "@tanstack/react-router";
import AdminUsagePage from "@/pages/admin-usage-page";

export const Route = createFileRoute("/_app/admin/usage")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminUsagePage />;
}
