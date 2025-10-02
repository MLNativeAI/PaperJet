import { createFileRoute, redirect } from "@tanstack/react-router";
import FinishPasswordResetPage from "@/pages/auth/finish-password-reset-page";
import z from "zod";

export const Route = createFileRoute("/auth/finish-password-reset")({
  component: FinishPasswordResetPage,
  validateSearch: z.object({
    token: z.string(),
  }),
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
});
