import { createFileRoute, notFound } from "@tanstack/react-router";
import WorkflowEditPage from "@/pages/workflow-edit-page";
import { hc } from "hono/client";
import type { WorkflowRoutes } from "@paperjet/api/routes";
import type { Workflow } from "@paperjet/engine/types";

const workflowClient = hc<WorkflowRoutes>("/api/v1/workflows");

export const Route = createFileRoute("/_app/workflows/$workflowId/edit")({
  loader: async ({ params }) => {
    try {
      const response = await workflowClient[":workflowId"].$get({
        param: { workflowId: params.workflowId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workflow");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching workflow:", error);
      throw notFound();
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const workflow = Route.useLoaderData();
  return <WorkflowEditPage workflow={workflow as Workflow} />;
}