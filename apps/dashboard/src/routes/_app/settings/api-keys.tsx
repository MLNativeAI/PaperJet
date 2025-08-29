import ApiKeysPage from "@/pages/settings/api-keys";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/api-keys")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ApiKeysPage />;
}
