import { createFileRoute } from "@tanstack/react-router";
import ExecutionPage from "@/pages/execution-page";

export const Route = createFileRoute("/_app/executions/$executionId")({
  component: ExecutionPage,
});
