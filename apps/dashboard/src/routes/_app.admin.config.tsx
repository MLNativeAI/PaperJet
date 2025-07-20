import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin/config")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/admin/config"!</div>;
}
