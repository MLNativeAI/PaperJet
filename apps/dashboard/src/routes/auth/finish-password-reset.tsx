import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/auth/finish-password-reset")({
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string(),
  }),
});

function RouteComponent() {
  return <div>Hello "/auth/finish-password-reset"!</div>;
}
