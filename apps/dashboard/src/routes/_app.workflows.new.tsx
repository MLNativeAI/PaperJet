import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/workflows/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/workflows/new"!</div>;
}
