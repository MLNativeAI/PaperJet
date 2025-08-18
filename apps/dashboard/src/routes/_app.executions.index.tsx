import { createFileRoute } from "@tanstack/react-router";
import ExecutionListPage from "@/pages/execution-list-page";

export const Route = createFileRoute("/_app/executions/")({
  component: ExecutionListPage,
});
