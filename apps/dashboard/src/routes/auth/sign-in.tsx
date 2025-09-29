import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import SignInPage from "@/pages/sign-in-page";

export const Route = createFileRoute("/auth/sign-in")({
  validateSearch: z.object({
    redirectTo: z.string().optional().catch("/"),
    notFound: z.string().optional(),
    invite: z.string().optional(),
  }),
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
  component: SignInPage,
});
