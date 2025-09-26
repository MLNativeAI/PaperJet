import { createFileRoute } from "@tanstack/react-router";
import SignInPage from "@/pages/sign-in-page";

export const Route = createFileRoute("/auth/sign-in")({
  validateSearch: (search: Record<string, unknown>) => ({
    notFound: search.notFound as string | undefined,
    invite: search.invite as string | undefined,
  }),
  beforeLoad: async ({ context }) => {
    return { authMode: context.serverInfo?.authMode };
  },
  component: SignInPage,
});
