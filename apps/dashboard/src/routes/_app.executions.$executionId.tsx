import { createFileRoute } from "@tanstack/react-router";
import ExecutionPage from "@/pages/execution-page";

export const Route = createFileRoute("/_app/executions/$executionId")({
  component: ExecutionPage,
  beforeLoad: () => {
    console.log("beforeLoad called");
    return {
      breadcrumbs: [
        {
          label: "Executions",
          link: "/executions",
        },
      ],
      useFullWidth: true,
    };
  },
});
