import { createFileRoute } from "@tanstack/react-router";
import WorkflowCreatePage from "@/pages/workflow-create-page";

export const Route = createFileRoute("/_app/workflows/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WorkflowCreatePage />;
}
