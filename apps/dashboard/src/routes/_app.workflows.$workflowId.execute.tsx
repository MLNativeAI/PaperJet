import { createFileRoute } from "@tanstack/react-router";
import WorkflowExecutorPage from "@/pages/workflow-executor-page";

export const Route = createFileRoute("/_app/workflows/$workflowId/execute")({
  component: WorkflowExecutorPage,
  beforeLoad: ({ params }) => {
    return {
      breadcrumbs: [
        {
          link: "/workflows",
          label: "Workflows",
        },
        {
          link: `/workflows/${params.workflowId}/execute`,
          label: "Execute workflow",
        },
      ],
    };
  },
});
