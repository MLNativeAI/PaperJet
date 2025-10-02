import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import AcceptInvitePage from "@/pages/auth/accept-invite-page";

export const Route = createFileRoute("/auth/accept-invite")({
  validateSearch: z.object({
    token: z.string(),
    email: z.string(),
  }),
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
  component: AcceptInvitePage,
});
